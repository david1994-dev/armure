import { headers } from "next/headers";
import { verifyCronSecret } from "@/lib/cron";
import { buildUnpaidList } from "@/lib/fund";
import { resolveVnMonth } from "@/lib/parse";
import { sendZaloMessage } from "@/lib/zalo";

export async function GET() {
  const authHeader = (await headers()).get("authorization");
  if (!verifyCronSecret(authHeader)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const chatId = process.env.ZALO_GROUP_CHAT_ID;
  if (!chatId) {
    console.error("[cron:remind-unpaid] ZALO_GROUP_CHAT_ID is not set");
    return new Response("ZALO_GROUP_CHAT_ID is not set", { status: 500 });
  }

  const currentMonth = resolveVnMonth(Date.now());
  const unpaid = await buildUnpaidList(currentMonth);
  if (unpaid.length === 0) {
    return new Response("ok", { status: 200 }); // ai cũng đã đóng đủ — không cần nhắc
  }

  // Bot không @mention ngược lại thành viên được — chỉ liệt kê tên dạng text. Không có mức đóng
  // chuẩn để so sánh (thành viên suy ra từ Thu, không có sheet roster riêng), nên chỉ biết ai
  // CHƯA có dòng nào trong tháng này — không biết ai đã đóng thiếu.
  const text = [
    `Nhắc đóng quỹ tháng ${currentMonth} — chưa thấy đóng:`,
    ...unpaid.map((member) => `- ${member.hoTen}`),
  ].join("\n");

  await sendZaloMessage({ chatId, text });
  return new Response("ok", { status: 200 });
}
