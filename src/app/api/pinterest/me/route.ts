import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "");

  if (!token) {
    return NextResponse.json({ error: "No token provided" }, { status: 401 });
  }

  try {
    const res = await fetch("https://api.pinterest.com/v5/user_account", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to fetch user");
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Pinterest me error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
