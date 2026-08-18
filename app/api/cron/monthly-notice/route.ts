import { headers } from "next/headers";
import { verifyCronSecret } from "@/lib/cron";
import { formatVnd } from "@/lib/format";
import { computeFundTotals } from "@/lib/fund";
import { resolveVnMonth } from "@/lib/parse";
import { sendZaloMessage } from "@/lib/zalo";

export async function GET() {
  const authHeader = (await headers()).get("authorization");
  if (!verifyCronSecret(authHeader)) {
    return new Response("Unauthorized", { status: 401 });
  }

  const chatId = process.env.ZALO_GROUP_CHAT_ID;
  if (!chatId) {
    console.error("[cron:monthly-notice] ZALO_GROUP_CHAT_ID is not set");
    return new Response("ZALO_GROUP_CHAT_ID is not set", { status: 500 });
  }

  const currentMonth = resolveVnMonth(Date.now());
  const totals = await computeFundTotals();

  const text = [
    `Thông báo đóng quỹ tháng ${currentMonth}.`,
    `Quỹ hiện tại: thu ${formatVnd(totals.tongThu)} | chi ${formatVnd(totals.tongChi)} | còn ${formatVnd(totals.soDu)}.`,
    `Trả lời hoặc @mention bot kèm số tiền để xác nhận đã đóng.`,
  ].join("\n");

  await sendZaloMessage({ chatId, text });
  return new Response("ok", { status: 200 });
}
