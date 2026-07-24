import { NextRequest, NextResponse } from "next/server";

async function getSpotifyToken(): Promise<string> {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  if (!client_id || !client_secret) {
    throw new Error("SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET must be set");
  }

  const authHeader = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const token = await getSpotifyToken();

    // Single track lookup: /api/spotify?track=TRACK_ID
    const trackId = searchParams.get("track");
    if (trackId) {
      const res = await fetch(`https://api.spotify.com/v1/tracks/${trackId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Playlist lookup: /api/spotify?playlist=PLAYLIST_ID
    const playlistId = searchParams.get("playlist");
    if (playlistId) {
      const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=20`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      return NextResponse.json(data);
    }

    // Default: search by query
    const query = searchParams.get("query") || "Chatpatti";
    const spotifyRes = await fetch(
      `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=6`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const data = await spotifyRes.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Spotify API error:", error);
    return NextResponse.json({ error: "Failed to fetch from Spotify API" }, { status: 500 });
  }
}
