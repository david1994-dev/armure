import { timingSafeEqual } from "node:crypto";

// Verified against a real captured payload (2026-08-18) — do not switch back to bot-api.zapps.me.
const API_BASE = process.env.ZALO_BOT_API_BASE || "https://bot-api.zaloplatforms.com";

function getToken(): string {
  const token = process.env.ZALO_BOT_TOKEN;
  if (!token) throw new Error("ZALO_BOT_TOKEN is not set");
  return token;
}

interface ZaloFrom {
  id: string;
  is_bot: boolean;
  display_name: string;
}

interface ZaloChat {
  chat_type: string;
  id: string;
}

interface ZaloMessage {
  message_id: string;
  date: number;
  chat: ZaloChat;
  from: ZaloFrom;
  text?: string;
  // Not observed in any captured payload yet (spec lists it, but Zalo's public docs don't). Only
  // start relying on this once a real reply-triggered webhook has been captured and inspected —
  // until then, month is always inferred from message text (see lib/parse.ts resolveVnMonth).
  reply_to_message?: ZaloMessage;
}

interface ZaloWebhookBody {
  event_name: string;
  message: ZaloMessage;
}

/**
 * Zalo's docs describe every webhook wrapped as `{ok, result}` (Telegram-Bot-API shape), but a
 * real captured payload (2026-08-18) had `event_name`/`message` at the top level instead. Handle
 * both — don't remove this just because the docs disagree with what we've actually observed.
 */
export function normalizeWebhookBody(raw: unknown): ZaloWebhookBody | null {
  if (!raw || typeof raw !== "object") return null;

  const wrapped = raw as { ok?: boolean; result?: unknown };
  const candidate = wrapped.ok !== undefined && wrapped.result ? wrapped.result : raw;

  const body = candidate as Partial<ZaloWebhookBody>;
  if (typeof body.event_name !== "string" || !body.message) return null;
  return body as ZaloWebhookBody;
}

export interface ZaloIncomingMessage {
  messageId: string;
  chatId: string;
  chatType: string;
  fromId: string;
  fromDisplayName: string;
  isBot: boolean;
  text: string;
  dateMs: number;
}

/** Combines normalizeWebhookBody with the field validation needed to safely process a message —
 * returns null for anything that isn't a text message (photo/sticker/voice events, etc). */
export function parseZaloWebhookPayload(raw: unknown): ZaloIncomingMessage | null {
  const body = normalizeWebhookBody(raw);
  if (!body || body.event_name !== "message.text.received") return null;

  const { message } = body;
  if (typeof message.text !== "string" || !message.from || !message.chat) return null;

  return {
    messageId: message.message_id,
    chatId: message.chat.id,
    chatType: message.chat.chat_type,
    fromId: message.from.id,
    fromDisplayName: message.from.display_name,
    isBot: message.from.is_bot,
    text: message.text,
    dateMs: message.date,
  };
}

/** Strips the "@<ZALO_BOT_NAME>" prefix from incoming text. ZALO_BOT_NAME must be the bot's full
 * display name including spaces (e.g. "Bot Team Fun") or this will leave stray words behind in
 * the parsed content. Zalo only delivers a webhook when the bot was mentioned or replied to, so a
 * message that doesn't literally contain the mention text (a reply, most likely) is still valid —
 * this only cleans the text, it never signals "not for the bot" by returning null. */
export function stripMention(text: string): string {
  const botName = process.env.ZALO_BOT_NAME;
  if (!botName) throw new Error("ZALO_BOT_NAME is not set");

  const mention = `@${botName}`;
  const idx = text.indexOf(mention);
  if (idx === -1) return text.trim();

  return (text.slice(0, idx) + text.slice(idx + mention.length)).trim();
}

/** Constant-time compare against ZALO_BOT_WEBHOOK_SECRET — same length-guard + timingSafeEqual
 * idiom as lib/admin-session.ts/lib/session.ts, just without the HMAC step since Zalo sends a
 * static token to match rather than a signature to verify. */
export function verifyWebhookSecret(headerValue: string | null): boolean {
  const expected = process.env.ZALO_BOT_WEBHOOK_SECRET;
  if (!expected || !headerValue) return false;

  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(headerValue);
  if (expectedBuffer.length !== actualBuffer.length) return false;
  return timingSafeEqual(expectedBuffer, actualBuffer);
}

interface ZaloApiResponse<T> {
  ok: boolean;
  result?: T;
  description?: string;
}

/** Zalo's Bot API is Telegram-Bot-API-shaped (per its own docs) — endpoint path and payload shape
 * below follow that convention. NOT yet verified against a live call; run this once (or the
 * equivalent curl) before relying on the webhook route, per CLAUDE.md's own instruction to
 * confirm with getMe before doing anything else. */
export async function getMe(): Promise<{ id: string; display_name: string } | null> {
  const response = await fetch(`${API_BASE}/bot${getToken()}/getMe`);
  const data = (await response.json()) as ZaloApiResponse<{ id: string; display_name: string }>;
  if (!response.ok || !data.ok) return null;
  return data.result ?? null;
}

export async function sendZaloMessage(params: {
  chatId: string;
  text: string;
  replyToMessageId?: string;
}): Promise<{ messageId: string | null }> {
  const response = await fetch(`${API_BASE}/bot${getToken()}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: params.chatId,
      text: params.text,
      reply_to_message_id: params.replyToMessageId,
    }),
  });

  if (!response.ok) {
    console.error(`[zalo] sendMessage failed: ${response.status} ${await response.text()}`);
    return { messageId: null };
  }

  const data = (await response.json()) as ZaloApiResponse<{ message_id?: string }>;
  return { messageId: data.result?.message_id ?? null };
}
