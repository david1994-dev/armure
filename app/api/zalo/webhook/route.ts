import { after } from "next/server";
import { headers } from "next/headers";
import { appendChi, appendThu, buildReplyText, computeFundTotals, transactionExists } from "@/lib/fund";
import { parseMessage, resolveVnDate, resolveVnMonth } from "@/lib/parse";
import { parseZaloWebhookPayload, sendZaloMessage, stripMention, verifyWebhookSecret } from "@/lib/zalo";

const LOG_PREFIX = "[zalo-webhook]";

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
      if (await transactionExists(incoming.messageId)) return; // Zalo có thể retry webhook

      const defaultMonth = resolveVnMonth(incoming.dateMs);
      const parsed = parseMessage(text, { defaultMonth });
      if (!parsed) return; // không khớp regex (thiếu số tiền cho "chi", hoặc có dấu hiệu phủ định/ý định tương lai)

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
      await sendZaloMessage({
        chatId: incoming.chatId,
        text: buildReplyText({ hoTen: incoming.fromDisplayName, parsed, totals }),
        replyToMessageId: incoming.messageId,
      });
    } catch (error) {
      console.error(`${LOG_PREFIX} processing failed: ${(error as Error).message}`);
    }
  });

  return new Response("ok", { status: 200 });
}
