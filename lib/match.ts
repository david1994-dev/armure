import { formatVnd } from "@/lib/format";
import type { Loser } from "@/lib/parse";
import { appendRow, getValues, updateCell } from "@/lib/sheets";

/**
 * Tab "KetQua" — thống kê thắng thua của các buổi đá (mỗi buổi = một khoản chi tiền sân):
 * A Ngày (DD/MM/YYYY) | B Tháng (YYYY-MM) | C Bên thua (Già/Trẻ; để trống = chưa biết, bot đã hỏi
 * và đang chờ trả lời) | D Tiền phạt | E message_id của tin chi tiền sân | F message_id của tin
 * trả lời (chống xử lý trùng khi Zalo retry).
 */
export const LOSS_FEE = 20_000;

export async function appendMatch(input: {
  ngay: string;
  thang: string;
  loser: Loser | null;
  messageId: string;
}): Promise<void> {
  await appendRow("KetQua!A:E", [input.ngay, input.thang, input.loser ?? "", LOSS_FEE, input.messageId]);
}

/** Điền bên thua vào trận chờ gần nhất. false = không có trận nào đang chờ, hoặc tin này đã xử lý rồi. */
export async function resolvePendingMatch(loser: Loser, answerMessageId: string): Promise<boolean> {
  const rows = await getValues("KetQua!A:F");
  if (rows.some((row) => row[5] === answerMessageId)) return false;

  for (let i = rows.length - 1; i >= 1; i--) {
    const row = rows[i];
    if (row?.[0] && !row[2]) {
      await updateCell(`KetQua!C${i + 1}`, loser);
      await updateCell(`KetQua!F${i + 1}`, answerMessageId);
      return true;
    }
  }
  return false;
}

export interface MatchStats {
  gia: number;
  tre: number;
  pending: number;
}

export async function computeMatchStats(thang: string): Promise<MatchStats> {
  const rows = (await getValues("KetQua!A:E")).slice(1).filter((row) => row[1] === thang);
  return {
    gia: rows.filter((row) => row[2] === "Già").length,
    tre: rows.filter((row) => row[2] === "Trẻ").length,
    pending: rows.filter((row) => !row[2]).length,
  };
}

export function buildStatsText(thang: string, stats: MatchStats): string {
  const [year, month] = thang.split("-");
  const title = `Thống kê thắng thua tháng ${month}/${year} (mỗi trận ${formatVnd(LOSS_FEE)}):`;
  if (stats.gia + stats.tre + stats.pending === 0) return `${title}\nChưa có trận nào được ghi nhận.`;

  const lines = [
    title,
    `- Già thua: ${stats.gia} trận = ${formatVnd(stats.gia * LOSS_FEE)}`,
    `- Trẻ thua: ${stats.tre} trận = ${formatVnd(stats.tre * LOSS_FEE)}`,
  ];
  if (stats.pending > 0) lines.push(`(Còn ${stats.pending} trận chưa ghi bên thua)`);
  return lines.join("\n");
}
