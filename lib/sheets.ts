import { JWT } from "google-auth-library";

const SHEETS_API_BASE = "https://sheets.googleapis.com/v4/spreadsheets";
const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getSpreadsheetId(): string {
  const id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;
  if (!id) throw new Error("GOOGLE_SHEETS_SPREADSHEET_ID is not set");
  return id;
}

function getServiceAccount(): { client_email: string; private_key: string } {
  const encoded = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  if (!encoded) throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is not set");

  const decoded = Buffer.from(encoded, "base64").toString("utf-8");
  const parsed = JSON.parse(decoded) as { client_email?: string; private_key?: string };
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing client_email/private_key");
  }
  return { client_email: parsed.client_email, private_key: parsed.private_key };
}

let cachedClient: JWT | null = null;

/** Mints (and google-auth-library internally caches/refreshes) the Sheets access token — only
 * used to get a bearer token, all actual Sheets calls below are plain fetch (lib/paypal.ts's
 * mint-token-then-fetch shape), not the googleapis SDK. */
async function getAccessToken(): Promise<string> {
  if (!cachedClient) {
    const account = getServiceAccount();
    cachedClient = new JWT({
      email: account.client_email,
      key: account.private_key,
      scopes: SCOPES,
    });
  }

  const { access_token: accessToken } = await cachedClient.authorize();
  if (!accessToken) throw new Error("Failed to mint a Google Sheets access token");
  return accessToken;
}

async function sheetsApiRequest<T>(path: string, init?: RequestInit): Promise<T> {
  const accessToken = await getAccessToken();
  const response = await fetch(`${SHEETS_API_BASE}/${getSpreadsheetId()}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Sheets API ${init?.method ?? "GET"} ${path} failed: ${response.status} ${await response.text()}`);
  }
  return response.json();
}

/** valueRenderOption=UNFORMATTED_VALUE so numeric cells come back as raw numbers (e.g. 200000)
 * instead of the display string ("200.000 ₫") — the Thu!D / Chi!B columns carry a currency number
 * format for display, and computeFundTotals()'s Number(row[0]) would silently read 0 (NaN → 0)
 * from the formatted string otherwise. Text cells (names, message_id) are unaffected either way. */
export async function getValues(range: string): Promise<string[][]> {
  const data = await sheetsApiRequest<{ values?: string[][] }>(
    `/values/${encodeURIComponent(range)}?valueRenderOption=UNFORMATTED_VALUE`,
  );
  return data.values ?? [];
}

/** `range` must be column-bounded (e.g. "Thu!A:E"), not just a bare sheet name — Sheets' table
 * auto-detection anchors on whatever contiguous column island it finds first, and a bare sheet
 * name lets it anchor past a blank column (e.g. onto a formula column further right), silently
 * writing the row into the wrong columns. valueInputOption=RAW (not USER_ENTERED) so Sheets never
 * reinterprets a value — USER_ENTERED parses "2026-08" as a date and silently converts it into a
 * serial number instead of keeping it as the literal text. */
export async function appendRow(range: string, row: (string | number)[]): Promise<void> {
  await sheetsApiRequest(`/values/${encodeURIComponent(range)}:append?valueInputOption=RAW`, {
    method: "POST",
    body: JSON.stringify({ values: [row] }),
  });
}

export async function updateCell(range: string, value: string | number): Promise<void> {
  await sheetsApiRequest(`/values/${encodeURIComponent(range)}?valueInputOption=RAW`, {
    method: "PUT",
    body: JSON.stringify({ values: [[value]] }),
  });
}
