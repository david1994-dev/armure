import { after } from "next/server";
import { headers } from "next/headers";
import { appendChi, appendThu, buildReplyText, computeFundTotals, transactionExists } from "@/lib/fund";
import { appendMatch, buildStatsText, computeMatchStats, describeResult, resolvePendingMatch } from "@/lib/match";
import {
  extractLoser,
  extractMonth,
  isSanExpense,
  isStatsRequest,
  parseLoserAnswer,
  parseMessage,
  resolveVnDate,
  resolveVnMonth,
} from "@/lib/parse";
import {
  parseZaloWebhookPayload,
  sendZaloMessage,
  sendZaloPhoto,
  stripMention,
  verifyWebhookSecret,
} from "@/lib/zalo";

const LOG_PREFIX = "[zalo-webhook]";

const QR_KEYWORD_RE = /\bqr\b/i;

/** Ảnh QR (ZALO_QR_IMAGE_URL, URL công khai) + chú thích (ZALO_QR_CAPTION: tên TK, STK, ngân hàng...).
 * Thiếu ảnh thì gửi riêng chú thích; thiếu cả hai thì im lặng. */
async function replyWithQr(chatId: string, replyToMessageId: string): Promise<void> {
  const photoUrl = process.env.ZALO_QR_IMAGE_URL;
  const caption = process.env.ZALO_QR_CAPTION;

  if (photoUrl && (await sendZaloPhoto({ chatId, photoUrl, caption }))) return;
  if (caption) await sendZaloMessage({ chatId, text: caption, replyToMessageId });
}

export async function POST(request: Request) {
  const bodyText = await request.text();
  const secret = (await headers()).get("x-bot-api-secret-token");
  if (!verifyWebhookSecret(secret)) {
    return new Response("Unauthorized", { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(bodyText);
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const incoming = parseZaloWebhookPayload(payload);
  if (!incoming || incoming.isBot) {
    return new Response("ok", { status: 200 });
  }

  const text = stripMention(incoming.text);

  // Trả 200 trước, xử lý sau bằng after() — Sheets + Claude cộng lại có thể vượt timeout webhook
  // của Zalo. Khác biệt có chủ đích so với app/api/webhooks/stripe|paypal (xử lý đồng bộ): 2 route
  // đó chỉ ghi Prisma (nhanh), route này gọi 2 API ngoài chậm hơn nhiều.
  after(async () => {
    try {
      // Tin có chữ "qr" → gửi thông tin QR chuyển khoản, không ghi sổ. Đặt trước transactionExists
      // vì không đụng tới Sheets.
      if (QR_KEYWORD_RE.test(text)) {
        await replyWithQr(incoming.chatId, incoming.messageId);
        return;
      }

      const defaultMonth = resolveVnMonth(incoming.dateMs);

      // "thống kê" → tổng kết thắng thua trong tháng (mặc định tháng hiện tại, hoặc "thống kê tháng 10").
      if (isStatsRequest(text)) {
        const thang = extractMonth(text, defaultMonth) ?? defaultMonth;
        await sendZaloMessage({
          chatId: incoming.chatId,
          text: buildStatsText(thang, await computeMatchStats(thang)),
          replyToMessageId: incoming.messageId,
        });
        return;
      }

      // Trả lời câu hỏi "hôm nay ai thua". Phải xử lý trước parseMessage (nếu không "già" bị hiểu
      // là tin đóng quỹ thiếu số tiền); không có trận nào đang chờ thì im lặng chứ không rơi xuống parse.
      const loserAnswer = parseLoserAnswer(text);
      if (loserAnswer) {
        if (await resolvePendingMatch(loserAnswer, incoming.messageId)) {
          await sendZaloMessage({
            chatId: incoming.chatId,
            text: describeResult(loserAnswer),
            replyToMessageId: incoming.messageId,
          });
        }
        return;
      }

      if (await transactionExists(incoming.messageId)) return; // Zalo có thể retry webhook

      const parsed = parseMessage(text, { defaultMonth });
      if (!parsed) return; // không khớp regex (thiếu số tiền cho "chi", hoặc có dấu hiệu phủ định/ý định tương lai)

      if (parsed === "ask-amount") {
        await sendZaloMessage({
          chatId: incoming.chatId,
          text: `${incoming.fromDisplayName} đóng bao nhiêu ạ? Vui lòng nhắn lại kèm số tiền, ví dụ: @${process.env.ZALO_BOT_NAME} Đã đóng 200K`,
          replyToMessageId: incoming.messageId,
        });
        return;
      }

      if (parsed.loai === "thu") {
        await appendThu({
          tenZalo: incoming.fromDisplayName,
          thang: parsed.thang,
          soTien: parsed.soTien,
          messageId: incoming.messageId,
        });
      } else {
        await appendChi({
          ngay: resolveVnDate(incoming.dateMs),
          soTien: parsed.soTien,
          lyDo: parsed.moTa,
          nguoiBao: incoming.fromDisplayName,
          messageId: incoming.messageId,
        });
      }

      const totals = await computeFundTotals();
      let replyText = buildReplyText({ hoTen: incoming.fromDisplayName, parsed, totals });

      // Chi tiền sân = một buổi đá: ghi bên thua nếu tin có sẵn, không thì hỏi (trả lời bằng cách
      // reply tin này hoặc @bot "già thua"/"trẻ thua", xử lý ở nhánh loserAnswer phía trên).
      if (parsed.loai === "chi" && isSanExpense(text)) {
        const loser = extractLoser(text);
        await appendMatch({
          ngay: resolveVnDate(incoming.dateMs),
          thang: defaultMonth,
          loser,
          messageId: incoming.messageId,
        });
        replyText += loser
          ? `\n${describeResult(loser)}`
          : "\nHôm nay ai thua? Trả lời: già thua, trẻ thua hoặc hoà.";
      }

      await sendZaloMessage({
        chatId: incoming.chatId,
        text: replyText,
        replyToMessageId: incoming.messageId,
      });
    } catch (error) {
      console.error(`${LOG_PREFIX} processing failed: ${(error as Error).message}`);
      // Route đã trả 200 cho Zalo trước khi chạy khối này nên Zalo sẽ không tự gửi lại webhook —
      // báo cho người dùng biết để họ tự nhắn lại, tránh mất giao dịch trong im lặng.
      await sendZaloMessage({
        chatId: incoming.chatId,
        text: "Có lỗi khi ghi nhận giao dịch, vui lòng thử nhắn lại.",
        replyToMessageId: incoming.messageId,
      });
    }
  });

  return new Response("ok", { status: 200 });
}
