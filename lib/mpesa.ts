import "server-only";

const MPESA_SUCCESS_RESULT_CODE = "0";

interface MpesaConfig {
  apiUrl: string;
  businessShortCode: string;
  callbackSecret: string;
  callbackUrl: string;
  consumerKey: string;
  consumerSecret: string;
  maxRetries: number;
  passkey: string;
  transactionType: string;
}

interface MpesaApiErrorShape {
  errorCode?: string;
  errorMessage?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
  ResultCode?: string;
  ResultDesc?: string;
}

export interface MpesaStkPushResponse {
  CustomerMessage?: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResponseCode?: string;
  ResponseDescription?: string;
}

export interface MpesaStkQueryResponse {
  ResponseCode?: string;
  ResponseDescription?: string;
  MerchantRequestID?: string;
  CheckoutRequestID?: string;
  ResultCode?: string;
  ResultDesc?: string;
}

interface CallbackMetadataItem {
  Name?: string;
  Value?: string | number;
}

export interface MpesaCallbackPayload {
  Body?: {
    stkCallback?: {
      MerchantRequestID?: string;
      CheckoutRequestID?: string;
      ResultCode?: number;
      ResultDesc?: string;
      CallbackMetadata?: {
        Item?: CallbackMetadataItem[];
      };
    };
  };
}

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is not configured.`);
  }

  return value;
}

function getMpesaConfig(): MpesaConfig {
  const apiUrl = (process.env.MPESA_API_URL ?? "https://sandbox.safaricom.co.ke").replace(
    /\/$/,
    "",
  );
  const callbackBaseUrl =
    process.env.MPESA_CALLBACK_URL ??
    process.env.NEXT_PUBLIC_APP_URL ??
    process.env.NEXTAUTH_URL;

  if (!callbackBaseUrl) {
    throw new Error("MPESA_CALLBACK_URL or NEXTAUTH_URL must be configured.");
  }

  const callbackSecret = getRequiredEnv("MPESA_CALLBACK_SECRET");
  const callbackUrl = new URL("/api/mpesa/callback", callbackBaseUrl);
  callbackUrl.searchParams.set("secret", callbackSecret);

  return {
    apiUrl,
    businessShortCode: getRequiredEnv("MPESA_BUSINESS_SHORT_CODE"),
    callbackSecret,
    callbackUrl: callbackUrl.toString(),
    consumerKey: getRequiredEnv("MPESA_CONSUMER_KEY"),
    consumerSecret: getRequiredEnv("MPESA_CONSUMER_SECRET"),
    maxRetries: Number.parseInt(process.env.MPESA_MAX_RETRIES ?? "3", 10) || 3,
    passkey: getRequiredEnv("MPESA_PASSKEY"),
    transactionType: process.env.MPESA_TRANSACTION_TYPE ?? "CustomerPayBillOnline",
  };
}

function getBasicAuthToken(config: MpesaConfig) {
  return Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString("base64");
}

function buildApiErrorMessage(prefix: string, payload?: MpesaApiErrorShape) {
  const detail =
    payload?.errorMessage ??
    payload?.ResponseDescription ??
    payload?.ResultDesc ??
    "Unknown M-Pesa error.";

  return `${prefix}: ${detail}`;
}

async function readJsonSafe(response: Response) {
  try {
    return (await response.json()) as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function generateMpesaTimestamp(date = new Date()) {
  const parts = [
    date.getFullYear().toString(),
    `${date.getMonth() + 1}`.padStart(2, "0"),
    `${date.getDate()}`.padStart(2, "0"),
    `${date.getHours()}`.padStart(2, "0"),
    `${date.getMinutes()}`.padStart(2, "0"),
    `${date.getSeconds()}`.padStart(2, "0"),
  ];

  return parts.join("");
}

export function normalizeMpesaPhoneNumber(phoneNumber: string) {
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  if (digitsOnly.startsWith("254") && digitsOnly.length === 12) {
    return digitsOnly;
  }

  if (digitsOnly.startsWith("0") && digitsOnly.length === 10) {
    return `254${digitsOnly.slice(1)}`;
  }

  if (digitsOnly.length === 9) {
    return `254${digitsOnly}`;
  }

  throw new Error("Phone number must be a valid Safaricom number in 07..., 7..., or 2547... format.");
}

function buildStkPassword(config: MpesaConfig, timestamp: string) {
  return Buffer.from(
    `${config.businessShortCode}${config.passkey}${timestamp}`,
  ).toString("base64");
}

export async function getMpesaAccessToken() {
  const config = getMpesaConfig();
  const response = await fetch(
    `${config.apiUrl}/oauth/v1/generate?grant_type=client_credentials`,
    {
      headers: {
        Authorization: `Basic ${getBasicAuthToken(config)}`,
      },
      cache: "no-store",
      method: "GET",
    },
  );

  const payload = (await readJsonSafe(response)) as { access_token?: string } & MpesaApiErrorShape | null;

  if (!response.ok || !payload?.access_token) {
    throw new Error(buildApiErrorMessage("Failed to get M-Pesa access token", payload ?? undefined));
  }

  return payload.access_token;
}

export async function initiateMpesaStkPush(input: {
  accountReference: string;
  amount: number;
  phoneNumber: string;
  transactionDescription: string;
}) {
  const config = getMpesaConfig();
  const accessToken = await getMpesaAccessToken();
  const timestamp = generateMpesaTimestamp();
  const normalizedPhoneNumber = normalizeMpesaPhoneNumber(input.phoneNumber);
  const response = await fetch(`${config.apiUrl}/mpesa/stkpush/v1/processrequest`, {
    body: JSON.stringify({
      BusinessShortCode: config.businessShortCode,
      Password: buildStkPassword(config, timestamp),
      Timestamp: timestamp,
      TransactionType: config.transactionType,
      Amount: Math.round(input.amount),
      PartyA: normalizedPhoneNumber,
      PartyB: config.businessShortCode,
      PhoneNumber: normalizedPhoneNumber,
      CallBackURL: config.callbackUrl,
      AccountReference: input.accountReference,
      TransactionDesc: input.transactionDescription,
    }),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = (await readJsonSafe(response)) as MpesaStkPushResponse & MpesaApiErrorShape | null;

  if (!response.ok || payload?.ResponseCode !== MPESA_SUCCESS_RESULT_CODE) {
    throw new Error(buildApiErrorMessage("M-Pesa STK push request failed", payload ?? undefined));
  }

  return {
    normalizedPhoneNumber,
    payload: payload ?? {},
  };
}

export async function queryMpesaStkPushStatus(checkoutRequestId: string) {
  const config = getMpesaConfig();
  const accessToken = await getMpesaAccessToken();
  const timestamp = generateMpesaTimestamp();
  const response = await fetch(`${config.apiUrl}/mpesa/stkpushquery/v1/query`, {
    body: JSON.stringify({
      BusinessShortCode: config.businessShortCode,
      Password: buildStkPassword(config, timestamp),
      Timestamp: timestamp,
      CheckoutRequestID: checkoutRequestId,
    }),
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    method: "POST",
  });
  const payload = (await readJsonSafe(response)) as MpesaStkQueryResponse & MpesaApiErrorShape | null;

  if (!response.ok || payload?.ResponseCode !== MPESA_SUCCESS_RESULT_CODE) {
    throw new Error(buildApiErrorMessage("M-Pesa status query failed", payload ?? undefined));
  }

  return payload ?? {};
}

export function parseMpesaCallback(payload: MpesaCallbackPayload) {
  const callback = payload.Body?.stkCallback;

  if (!callback?.CheckoutRequestID) {
    throw new Error("Callback payload is missing CheckoutRequestID.");
  }

  const metadata = new Map<string, string | number>();

  for (const item of callback.CallbackMetadata?.Item ?? []) {
    if (!item?.Name || item.Value === undefined) {
      continue;
    }

    metadata.set(item.Name, item.Value);
  }

  return {
    checkoutRequestId: callback.CheckoutRequestID,
    merchantRequestId: callback.MerchantRequestID ?? null,
    resultCode: `${callback.ResultCode ?? ""}`,
    resultDescription: callback.ResultDesc ?? null,
    mpesaReceiptNumber: (metadata.get("MpesaReceiptNumber") as string | undefined) ?? null,
    phoneNumber: metadata.get("PhoneNumber")
      ? `${metadata.get("PhoneNumber")}`
      : null,
    rawPayload: payload,
    transactionDate: metadata.get("TransactionDate")
      ? `${metadata.get("TransactionDate")}`
      : null,
  };
}

export function getMpesaMaxRetries() {
  return Number.parseInt(process.env.MPESA_MAX_RETRIES ?? "3", 10) || 3;
}

export function getMpesaCallbackSecret() {
  return getRequiredEnv("MPESA_CALLBACK_SECRET");
}
