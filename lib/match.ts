import { formatVnd } from "@/lib/format";
import type { MatchResult } from "@/lib/parse";
import { appendRow, getValues, updateCell } from "@/lib/sheets";

/**
 * Tab "KetQua" — thống kê thắng thua của các buổi đá (mỗi buổi = một khoản chi tiền sân):
 * A Ngày (DD/MM/YYYY) | B Tháng (YYYY-MM) | C Kết quả (Già/Trẻ = bên thua, Hòa = hoà; để trống =
 * chưa biết, bot đã hỏi và đang chờ trả lời) | D Tiền phạt (0 nếu hoà) | E message_id của tin chi
 * tiền sân | F message_id của tin trả lời (chống xử lý trùng khi Zalo retry).
 */
export const LOSS_FEE = 20_000;

function feeFor(result: MatchResult | null): number {
  return result === "Hòa" ? 0 : LOSS_FEE;
}

/** Câu xác nhận gửi lại nhóm sau khi ghi kết quả. */
export function describeResult(result: MatchResult): string {
  return result === "Hòa" ? "Đã ghi nhận: trận hôm nay hoà." : `Đã ghi nhận: ${result} thua trận hôm nay.`;
}

export async function appendMatch(input: {
  ngay: string;
  thang: string;
  loser: MatchResult | null;
  messageId: string;
}): Promise<void> {
  await appendRow("KetQua!A:E", [input.ngay, input.thang, input.loser ?? "", feeFor(input.loser), input.messageId]);
}

/** Điền kết quả vào trận chờ gần nhất. false = không có trận nào đang chờ, hoặc tin này đã xử lý rồi. */
export async function resolvePendingMatch(result: MatchResult, answerMessageId: string): Promise<boolean> {
  const rows = await getValues("KetQua!A:F");
  if (rows.some((row) => row[5] === answerMessageId)) return false;

  for (let i = rows.length - 1; i >= 1; i--) {
    const row = rows[i];
    if (row?.[0] && !row[2]) {
      await updateCell(`KetQua!C${i + 1}`, result);
      if (result === "Hòa") await updateCell(`KetQua!D${i + 1}`, 0);
      await updateCell(`KetQua!F${i + 1}`, answerMessageId);
      return true;
    }
  }
  return false;
}

export interface MatchStats {
  gia: number;
  tre: number;
  hoa: number;
  pending: number;
}

export async function computeMatchStats(thang: string): Promise<MatchStats> {
  const rows = (await getValues("KetQua!A:E")).slice(1).filter((row) => row[1] === thang);
  return {
    gia: rows.filter((row) => row[2] === "Già").length,
    tre: rows.filter((row) => row[2] === "Trẻ").length,
    hoa: rows.filter((row) => row[2] === "Hòa").length,
    pending: rows.filter((row) => !row[2]).length,
  };
}

export function buildStatsText(thang: string, stats: MatchStats): string {
  const [year, month] = thang.split("-");
  const title = `Thống kê thắng thua tháng ${month}/${year} (mỗi trận ${formatVnd(LOSS_FEE)}):`;
  if (stats.gia + stats.tre + stats.hoa + stats.pending === 0) return `${title}\nChưa có trận nào được ghi nhận.`;

  const lines = [
    title,
    `- Già thua: ${stats.gia} trận = ${formatVnd(stats.gia * LOSS_FEE)}`,
    `- Trẻ thua: ${stats.tre} trận = ${formatVnd(stats.tre * LOSS_FEE)}`,
  ];
  if (stats.hoa > 0) lines.push(`- Hoà: ${stats.hoa} trận`);
  if (stats.pending > 0) lines.push(`(Còn ${stats.pending} trận chưa ghi kết quả)`);
  return lines.join("\n");
}
