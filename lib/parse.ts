export type Loai = "thu" | "chi";

export interface ParsedTransaction {
  loai: Loai;
  soTien: number;
  thang: string; // YYYY-MM
  moTa: string;
}

/** Vercel runs UTC — always derive VN-local month (UTC+7) from the message timestamp, never
 * `new Date().getMonth()` directly. */
export function resolveVnMonth(dateMs: number): string {
  const vnDate = new Date(dateMs + 7 * 60 * 60 * 1000);
  return `${vnDate.getUTCFullYear()}-${String(vnDate.getUTCMonth() + 1).padStart(2, "0")}`;
}

/** DD/MM/YYYY, VN-local (UTC+7) — for the Chi sheet's "Ngày" column. */
export function resolveVnDate(dateMs: number): string {
  const vnDate = new Date(dateMs + 7 * 60 * 60 * 1000);
  const day = String(vnDate.getUTCDate()).padStart(2, "0");
  const month = String(vnDate.getUTCMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${vnDate.getUTCFullYear()}`;
}

const AMOUNT_TR_RE = /(\d+)\s*tr\s*(\d)?\b/;
const AMOUNT_K_RE = /(\d+(?:[.,]\d+)?)\s*k\b/;
const AMOUNT_NUMERIC_RE = /\d{1,3}(?:[.,]\d{3})+|\d{4,}/;

export function extractAmount(text: string): number | null {
  const normalized = text.toLowerCase();

  // "1tr5", "1tr2" => N triệu + N trăm nghìn (1tr5 = 1,500,000)
  const trMatch = normalized.match(AMOUNT_TR_RE);
  if (trMatch) {
    const millions = Number(trMatch[1]);
    const hundredThousands = trMatch[2] ? Number(trMatch[2]) : 0;
    return millions * 1_000_000 + hundredThousands * 100_000;
  }

  // "200k", "350k", "200.5k"
  const kMatch = normalized.match(AMOUNT_K_RE);
  if (kMatch) {
    return Math.round(Number(kMatch[1].replace(",", ".")) * 1000);
  }

  // "200.000" / "200,000" (thousand separators) or a bare 4+ digit number like "200000"
  const numericMatch = normalized.match(AMOUNT_NUMERIC_RE);
  if (numericMatch) {
    return Number(numericMatch[0].replace(/[.,]/g, ""));
  }

  return null;
}

export function extractMonth(text: string, defaultMonth: string): string | null {
  const normalized = text.toLowerCase();
  const match = normalized.match(/th[aá]ng\s*(\d{1,2})/) ?? normalized.match(/\bt(\d{1,2})\b/);
  if (!match) return null;

  const month = Number(match[1]);
  if (month < 1 || month > 12) return null;

  const year = defaultMonth.split("-")[0];
  return `${year}-${String(month).padStart(2, "0")}`;
}

// Mức đóng quỹ cố định — mọi lượt @mention không phải "chi ..." mặc định là 1 lượt đóng quỹ
// 200k, không cần trích xuất số tiền (chủ quỹ xác nhận số tiền chuyển khoản luôn cố định).
const DUES_AMOUNT = 200_000;

const CHI_KEYWORD_RE = /\bchi\b/i;

// "chưa đóng", "để cuối tuần mình ck", "sẽ chuyển"... không phải xác nhận đã đóng tiền. Vì thiết
// kế mới coi MỌI tin không chứa "chi" là đã đóng 200k, phải loại các câu này trước — nếu không sẽ
// ghi nhầm thành đã đóng quỹ.
// Không dùng \b quanh "sẽ"/"định" — \w trong regex JS không coi các ký tự có dấu (ẽ, đ...) là
// word char, nên \bsẽ\b/\bđịnh\b sẽ không bao giờ khớp (silent false negative).
const UNCERTAIN_MARKERS = [/chưa/, /sẽ/, /định/, /để\s+(cuối|mai|tuần|tháng)/];

function hasUncertainMarker(text: string): boolean {
  return UNCERTAIN_MARKERS.some((re) => re.test(text.toLowerCase()));
}

function stripChiPrefix(text: string): string {
  return text
    .replace(CHI_KEYWORD_RE, "")
    .replace(AMOUNT_TR_RE, "")
    .replace(AMOUNT_K_RE, "")
    .replace(AMOUNT_NUMERIC_RE, "")
    .trim();
}

/**
 * Parse thuần regex, không gọi Claude — miễn phí hoàn toàn. Quy tắc: tin nhắn chứa từ khóa "chi"
 * là một khoản chi (phải kèm số tiền, đúng định dạng "chi <số tiền> [lý do]"); mọi tin nhắn khác
 * (không có "chi", không có dấu hiệu phủ định/ý định tương lai) mặc định là một lượt đóng quỹ cố
 * định 200k.
 */
export function parseMessage(text: string, ctx: { defaultMonth: string }): ParsedTransaction | null {
  const trimmed = text.trim();
  if (!trimmed || hasUncertainMarker(trimmed)) return null;

  if (CHI_KEYWORD_RE.test(trimmed)) {
    const soTien = extractAmount(trimmed);
    if (!soTien) return null; // gõ "chi" nhưng thiếu số tiền — không đoán bừa, bỏ qua

    return {
      loai: "chi",
      soTien,
      thang: ctx.defaultMonth,
      moTa: stripChiPrefix(trimmed) || "Chi tiêu",
    };
  }

  return {
    loai: "thu",
    soTien: DUES_AMOUNT,
    thang: extractMonth(trimmed, ctx.defaultMonth) ?? ctx.defaultMonth,
    moTa: trimmed,
  };
}
