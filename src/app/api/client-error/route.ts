import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    console.error("[client-error]", body ? JSON.stringify(body, null, 2) : "(no body)");
  } catch (err) {
    console.error("[client-error] failed to parse request", err);
  }

  return new NextResponse(null, { status: 204 });
}
