"use client";
import { useState, useEffect, useRef } from "react";

export default function InstantAnonymousChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let guestId = localStorage.getItem("guest_session_id");
    if (!guestId) {
      guestId = "guest_" + Math.random().toString(36).substring(2, 9);
      localStorage.setItem("guest_session_id", guestId);
    }
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg = input.trim();
    setInput("");

    const newMessages = [...messages, { role: "user", content: userMsg }];
    setMessages(newMessages);
    setIsTyping(true);

    try {
      const res = await fetch("/api/gemini-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageHistory: newMessages.map(m => ({ role: m.role, parts: [{ text: m.content }] })) }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let aiResponse = "";

      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        aiResponse += chunk;

        setMessages((prev) => {
          const last = prev[prev.length - 1];
          return [...prev.slice(0, -1), { ...last, content: aiResponse }];
        });
      }
    } catch (err) {
      console.error("Chat error:", err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div style={{ maxWidth: "750px", margin: "30px auto", height: "88vh", display: "flex", flexDirection: "column", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", border: "1px solid #e2e8f0", borderRadius: "12px", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
      <header style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", background: "#ffffff", borderTopLeftRadius: "12px", borderTopRightRadius: "12px" }}>
        <h2 style={{ margin: 0, color: "#1e293b" }}>💕 CHATPATTIE BADDIE</h2>
        <span style={{ fontSize: "12px", background: "#dcfce7", color: "#15803d", padding: "4px 10px", borderRadius: "20px", fontWeight: "600" }}>Guest Mode</span>
      </header>

      <main style={{ flex: 1, padding: "20px", overflowY: "auto", background: "#fafafa" }}>
        {messages.length === 0 && (
          <div style={{ textAlign: "center", color: "#64748b", marginTop: "30%", fontSize: "16px" }}>
            👋 Welcome! Ask anything.
          </div>
        )}

        {messages.map((m, index) => (
          <div key={index} style={{ display: "flex", marginBottom: "12px", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{ maxWidth: "75%", padding: "12px 16px", borderRadius: "16px", lineHeight: "1.5", fontSize: "15px", whiteSpace: "pre-wrap", background: m.role === "user" ? "#2563eb" : "#f1f5f9", color: m.role === "user" ? "#ffffff" : "#0f172a" }}>
              {m.content || (isTyping && index === messages.length - 1 ? "..." : "")}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </main>

      <footer style={{ padding: "16px", borderTop: "1px solid #e2e8f0", display: "flex", gap: "10px", background: "#ffffff", borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}>
        <input type="text" value={input} placeholder="Type your message..." onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} style={{ flex: 1, padding: "12px 16px", border: "1px solid #cbd5e1", borderRadius: "8px", fontSize: "15px", outline: "none" }} />
        <button onClick={handleSend} disabled={isTyping} style={{ padding: "12px 24px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: "600", cursor: "pointer" }}>Send</button>
      </footer>
    </div>
  );
}
