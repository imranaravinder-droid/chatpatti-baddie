import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const authorizationCode = searchParams.get("code");

  if (!authorizationCode) {
    return new Response(`<html><body><h2>Authorization failed</h2><p>No code received from Pinterest.</p><a href="/pinterest">Try again</a></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  const CLIENT_ID = process.env.PINTEREST_CLIENT_ID;
  const CLIENT_SECRET = process.env.PINTEREST_CLIENT_SECRET;

  if (!CLIENT_ID || !CLIENT_SECRET) {
    return new Response(`<html><body><h2>Server config error</h2><p>Pinterest credentials not set.</p></body></html>`, {
      headers: { "Content-Type": "text/html" },
    });
  }

  const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : "http://localhost:3000";

  const REDIRECT_URI = `${baseUrl}/api/pinterest/callback`;

  try {
    const authHeader = Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString("base64");

    const tokenRes = await fetch("https://api.pinterest.com/v5/oauth/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: authorizationCode,
        redirect_uri: REDIRECT_URI,
        continuous_refresh: "true",
      }).toString(),
    });

    const tokenData = await tokenRes.json();

    if (!tokenRes.ok) {
      throw new Error(tokenData.message || "Token exchange failed");
    }

    const accessToken = tokenData.access_token;
    const refreshToken = tokenData.refresh_token || "";
    const headers = { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" };

    // Fetch user account info
    let userAccount: any = {};
    try {
      const userRes = await fetch("https://api.pinterest.com/v5/user_account", { headers });
      userAccount = await userRes.json();
    } catch {}

    // Fetch boards first
    let boards: any[] = [];
    try {
      const boardsRes = await fetch("https://api.pinterest.com/v5/boards?page_size=25", { headers });
      const boardsData = await boardsRes.json();
      boards = boardsData.items || [];
    } catch {}

    // Fetch pins from each board
    let allPins: any[] = [];
    for (const board of boards) {
      try {
        const pinsRes = await fetch(`https://api.pinterest.com/v5/boards/${board.id}/pins?page_size=25`, { headers });
        const pinsData = await pinsRes.json();
        if (pinsData.items) {
          allPins = allPins.concat(pinsData.items.map((p: any) => ({ ...p, board_name: board.name })));
        }
      } catch {}
    }

    // Fallback: try user-level pins
    if (allPins.length === 0) {
      try {
        const pinsRes = await fetch("https://api.pinterest.com/v5/pins?page_size=25", { headers });
        const pinsData = await pinsRes.json();
        allPins = pinsData.items || [];
      } catch {}
    }

    return new Response(
      `<!DOCTYPE html>
<html><head><title>Pinterest Connected</title>
<style>
body { font-family: system-ui; background: #0b0f19; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
.card { background: #151c2c; border: 1px solid #1e293b; border-radius: 20px; padding: 40px; max-width: 500px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
h1 { color: #e60023; }
.btn { display: inline-block; margin-top: 20px; padding: 12px 32px; background: #6366f1; color: #fff; text-decoration: none; border-radius: 30px; font-weight: bold; }
</style></head>
<body>
<div class="card">
  <h1>✅ Pinterest Connected!</h1>
  <p style="color:#94a3b8">Your Pinterest account is linked to CHATPATTIE BADDIE.</p>
  <p>Connected as <strong>${userAccount.username || userAccount.full_name || "Pinterest user"}</strong> • ${boards.length} boards, ${allPins.length} pins.</p>
  <a href="/pinterest" class="btn">View Pins</a>
  <script>
    localStorage.setItem("pinterest_token", ${JSON.stringify(accessToken)});
    localStorage.setItem("pinterest_refresh_token", ${JSON.stringify(refreshToken)});
    localStorage.setItem("pinterest_pins", ${JSON.stringify(JSON.stringify(allPins))});
    localStorage.setItem("pinterest_boards", ${JSON.stringify(JSON.stringify(boards))});
  </script>
</div>
</body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  } catch (error: any) {
    console.error("Pinterest callback error:", error);
    return new Response(
      `<html><body><h2>Error</h2><p>${error.message}</p><a href="/pinterest">Try again</a></body></html>`,
      { headers: { "Content-Type": "text/html" } }
    );
  }
}
