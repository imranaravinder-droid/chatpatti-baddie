import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("ig_token")?.value;
  const username = req.cookies.get("ig_username")?.value;
  if (!token) return NextResponse.json({ connected: false }, { status: 200 });

  try {
    const meRes = await fetch(
      `https://graph.instagram.com/me?fields=id,username,account_type,media_count,profile_picture_url&access_token=${token}`
    );
    const me = await meRes.json();
    if (!me.id) return NextResponse.json({ connected: false, username, error: "Token expired" }, { status: 200 });

    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,thumbnail_url,permalink,timestamp&limit=12&access_token=${token}`
    );
    const mediaData = await mediaRes.json();

    return NextResponse.json({
      connected: true,
      profile: {
        id: me.id,
        username: me.username,
        account_type: me.account_type,
        media_count: me.media_count,
        profile_picture_url: me.profile_picture_url,
      },
      media: (mediaData.data || []).map((m: any) => ({
        id: m.id,
        media_type: m.media_type,
        media_url: m.media_url,
        thumbnail_url: m.thumbnail_url,
        permalink: m.permalink,
        caption: m.caption || "",
        timestamp: m.timestamp,
      })),
    });
  } catch (err: any) {
    return NextResponse.json({ connected: false, username, error: err.message }, { status: 200 });
  }
}
