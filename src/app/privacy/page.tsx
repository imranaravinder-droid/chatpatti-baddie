"use client";

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", backgroundColor: "#0b0f19", color: "#f8fafc", minHeight: "100vh", padding: "40px 20px" }}>
      <div style={{ maxWidth: "700px", margin: "0 auto", background: "#151c2c", border: "1px solid #1e293b", borderRadius: "20px", padding: "40px" }}>
        <h1 style={{ margin: "0 0 8px 0", fontSize: "28px" }}>Privacy Policy</h1>
        <p style={{ color: "#94a3b8", fontSize: "14px", marginBottom: "24px" }}>Last updated: July 24, 2026</p>

        <h2>Information We Collect</h2>
        <p>When you use CHATPATTIE BADDIE, we collect:</p>
        <ul style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
          <li><strong>Account data:</strong> Name and email address (provided at signup)</li>
          <li><strong>Chat data:</strong> Messages you send to AI agents (stored for conversation history)</li>
          <li><strong>Social logins:</strong> When you connect Pinterest or Instagram, we store an access token to fetch your pins/posts. We never store your social passwords.</li>
        </ul>

        <h2>How We Use Your Data</h2>
        <ul style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
          <li>To provide AI chat responses and image generation</li>
          <li>To show your Pinterest pins and Instagram posts within the app</li>
          <li>To improve our services</li>
        </ul>

        <h2>Data Storage</h2>
        <p>Your data is stored securely on Neon PostgreSQL database. Chat messages are encrypted before storage. Pinterest and Instagram tokens are stored in your browser's localStorage and never shared.</p>

        <h2>Third-Party Services</h2>
        <ul style={{ color: "#cbd5e1", lineHeight: "1.8" }}>
          <li><strong>Google AdSense</strong> — displays ads</li>
          <li><strong>Google Gemini</strong> — powers AI chat</li>
          <li><strong>Pinterest API</strong> — fetches your pins when you connect</li>
          <li><strong>Instagram API</strong> — fetches your posts when you connect</li>
        </ul>

        <h2>Your Rights</h2>
        <p>You can delete your chat history or your entire account at any time from the dashboard. Disconnecting Pinterest/Instagram removes those tokens immediately.</p>

        <h2>Contact</h2>
        <p style={{ color: "#cbd5e1" }}>Questions? Reach out via the Crisp chat widget on our site.</p>
      </div>
    </div>
  );
}
