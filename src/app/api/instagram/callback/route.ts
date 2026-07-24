import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authorizationCode = searchParams.get("code");
  const error = searchParams.get("error");

  if (error) {
    return new Response(`<html><body><h2>Access Denied</h2><p>You denied the authorization request.</p><a href="/instagram">Try again</a></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  if (!authorizationCode) {
    return new Response(`<html><body><h2>Authorization failed</h2><p>No code received from Instagram.</p><a href="/instagram">Try again</a></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  const CLIENT_ID = process.env.INSTAGRAM_CLIENT_ID;
  const CLIENT_SECRET = process.env.INSTAGRAM_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response(`<html><body><h2>Server config error</h2><p>Instagram credentials not set.</p></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const REDIRECT_URI = `${baseUrl}/api/instagram/callback`;

  try {
    // Step 2: Exchange code for short-lived access token
    const tokenRes = await fetch("https://api.instagram.com/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: "authorization_code",
        redirect_uri: REDIRECT_URI,
        code: authorizationCode,
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(tokenData.error_message || tokenData.error || "Token exchange failed");
    }

    // Response is wrapped in data[0]
    const shortLivedToken = tokenData.data?.[0]?.access_token || tokenData.access_token;
    const userId = tokenData.data?.[0]?.user_id || tokenData.user_id;

    if (!shortLivedToken) {
      throw new Error("No access token received");
    }

    // Step 3: Exchange short-lived token for long-lived token (60 days)
    let longLivedToken = shortLivedToken;
    try {
      const longTokenRes = await fetch(
        `https://graph.instagram.com/access_token?grant_type=ig_exchange_token&client_secret=${CLIENT_SECRET}&access_token=${shortLivedToken}`
      );
      const longTokenData = await longTokenRes.json();
      if (longTokenData.access_token) {
        longLivedToken = longTokenData.access_token;
      }
    } catch {}

    // Fetch user media with the long-lived token
    const mediaRes = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_type,media_url,permalink,timestamp&access_token=${longLivedToken}`
    );

    const mediaData = await mediaRes.json();

    return new Response(
      `<!DOCTYPE html>
<html><head><title>Instagram Connected</title>
<style>
body { font-family: system-ui; background: #0b0f19; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
.card { background: #151c2c; border: 1px solid #1e293b; border-radius: 20px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
h1 { background: linear-gradient(135deg, #f58529, #dd2a7b, #8134af); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
.btn { display: inline-block; margin-top: 20px; padding: 12px 32px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 30px; font-weight: bold; font-size: 14px; }
</style></head>
<body>
<div class="card">
  <h1>✅ Instagram Connected!</h1>
  <p style="color:#94a3b8">Your Instagram Business account is linked to CHATPATTIE BADDIE.</p>
  <p>Fetched ${mediaData.data?.length || 0} posts.</p>
  <a href="/instagram" class="btn">View Posts</a>
  <script>
    localStorage.setItem("instagram_token", ${JSON.stringify(longLivedToken)});
    localStorage.setItem("instagram_user_id", ${JSON.stringify(userId)});
    localStorage.setItem("instagram_posts", ${JSON.stringify(JSON.stringify(mediaData.data || []))});
  </script>
</div>
</body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Instagram callback error:", error);
    return new Response(
      `<html><body><h2>Error</h2><p>${error.message}</p><a href="/instagram">Try again</a></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
