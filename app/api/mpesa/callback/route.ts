import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getMpesaCallbackSecret, type MpesaCallbackPayload } from "@/lib/mpesa";
import { reconcileMpesaCallback } from "@/lib/mpesa-payments";

function buildAcceptedResponse(message: string) {
  return NextResponse.json({
    ResultCode: 0,
    ResultDesc: message,
  });
}

export async function POST(request: Request) {
  const url = new URL(request.url);
  const providedSecret = url.searchParams.get("secret");

  if (!providedSecret || providedSecret !== getMpesaCallbackSecret()) {
    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Unauthorized callback.",
      },
      { status: 401 },
    );
  }

  let payload: MpesaCallbackPayload;

  try {
    payload = (await request.json()) as MpesaCallbackPayload;
  } catch {
    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Invalid callback payload.",
      },
      { status: 400 },
    );
  }

  try {
    const result = await reconcileMpesaCallback(payload);

    revalidatePath("/", "layout");
    revalidatePath("/account");
    revalidatePath("/checkout");
    revalidatePath("/checkout/success");

    if (!result.matched) {
      return buildAcceptedResponse("Callback received without a matching payment.");
    }

    return buildAcceptedResponse("Callback processed successfully.");
  } catch (error) {
    console.error("M-Pesa callback handling error:", error);

    return NextResponse.json(
      {
        ResultCode: 1,
        ResultDesc: "Callback processing failed.",
      },
      { status: 500 },
    );
  }
}
