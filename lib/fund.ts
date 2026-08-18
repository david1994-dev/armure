import { formatVnd } from "@/lib/format";
import type { ParsedTransaction } from "@/lib/parse";
import { appendRow, getValues } from "@/lib/sheets";

/**
 * Sheet thật của chủ quỹ (2 tab, không có ThanhVien/TheoThang/Config riêng):
 *
 * Thu: A STT | B Tên Zalo | C Tháng (YYYY-MM) | D Số Tiền Đóng | E message_id (cột ẩn, chỉ để
 *   chống ghi trùng khi Zalo retry webhook — không phải cột nghiệp vụ) | F Số Dư Quỹ (CÔNG THỨC
 *   Google Sheets tự tính — bot không bao giờ ghi vào cột này, chủ quỹ tự đặt công thức).
 *
 * Chi: A Ngày (DD/MM/YYYY) | B Số Tiền | C Lý Do | D Người báo | E message_id (cột ẩn).
 */

export async function transactionExists(messageId: string): Promise<boolean> {
  const [thuIds, chiIds] = await Promise.all([getValues("Thu!E:E"), getValues("Chi!E:E")]);
  return thuIds.some((row) => row[0] === messageId) || chiIds.some((row) => row[0] === messageId);
}

async function nextRowCount(sheetName: string): Promise<number> {
  const values = await getValues(`${sheetName}!A:A`);
  return Math.max(values.length - 1, 0); // trừ header
}

export async function appendThu(input: {
  tenZalo: string;
  thang: string;
  soTien: number;
  messageId: string;
}): Promise<void> {
  const stt = (await nextRowCount("Thu")) + 1;
  await appendRow("Thu!A:E", [stt, input.tenZalo, input.thang, input.soTien, input.messageId]);
}

export async function appendChi(input: {
  ngay: string;
  soTien: number;
  lyDo: string;
  nguoiBao: string;
  messageId: string;
}): Promise<void> {
  await appendRow("Chi!A:E", [input.ngay, input.soTien, input.lyDo, input.nguoiBao, input.messageId]);
}

export interface FundTotals {
  tongThu: number;
  tongChi: number;
  soDu: number;
}

/** Đọc trực tiếp cột D của Thu / cột B của Chi để trả lời ngay trong tin nhắn — độc lập với công
 * thức ở cột F của Thu (công thức đó chỉ để hiển thị trong sheet, chủ quỹ tự quản lý). */
export async function computeFundTotals(): Promise<FundTotals> {
  const [thuRows, chiRows] = await Promise.all([getValues("Thu!D:D"), getValues("Chi!B:B")]);
  const tongThu = thuRows.slice(1).reduce((sum, row) => sum + (Number(row[0]) || 0), 0);
  const tongChi = chiRows.slice(1).reduce((sum, row) => sum + (Number(row[0]) || 0), 0);
  return { tongThu, tongChi, soDu: tongThu - tongChi };
}

export function buildReplyText(input: { hoTen: string; parsed: ParsedTransaction; totals: FundTotals }): string {
  const { hoTen, parsed, totals } = input;
  const action = parsed.loai === "thu" ? "Đã ghi nhận thu" : "Đã ghi nhận chi";
  return [
    `${action}: ${hoTen} — ${formatVnd(parsed.soTien)} (${parsed.moTa})`,
    `Quỹ hiện tại: thu ${formatVnd(totals.tongThu)} | chi ${formatVnd(totals.tongChi)} | còn ${formatVnd(totals.soDu)}`,
  ].join("\n");
}
