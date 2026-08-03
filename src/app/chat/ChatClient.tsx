"use client";

import { useEffect, useState, useRef } from "react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import VentInput from "@/components/VentInput";
import LanguageSelector from "@/components/LanguageSelector";
import ModalitySwitcher from "@/components/ModalitySwitcher";
import { Language } from "@/lib/lang";
import { Mode } from "@/types";

const IMAGE_KEYWORDS = ["generate image", "create image", "make image", "draw", "generate a image", "create an image", "generate a picture", "make a picture", "generate an image", "create a picture"];
const VIDEO_KEYWORDS = ["generate video", "create video", "make video", "generate a video", "create a video", "make a video"];

type Message = { role: "user" | "assistant"; content: string; imageUrl?: string; videoUrl?: string };

export default function ChatPage() {
  const authorized = useRequireAuth();
  const [mode, setMode] = useState<Mode>("casual");
  const [responseText, setResponseText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [lang, setLang] = useState<Language>("en");
  const [messages, setMessages] = useState<Message[]>([]);
  const [refCode, setRefCode] = useState("");
  const [refCount, setRefCount] = useState(0);
  const [genLoading, setGenLoading] = useState(false);

  useEffect(() => {
    if (!authorized) return;
    const email = localStorage.getItem("baddie_user_email");
    const code = localStorage.getItem("baddie_ref_code") || (email ? btoa(email).replace(/=/g, "").substring(0, 12) : "");
    setRefCode(code);
    const count = parseInt(localStorage.getItem("baddie_ref_count") || "0", 10);
    setRefCount(count);
  }, [authorized]);

  const refLink = `https://cpbaddie.vercel.app/?ref=${refCode}`;

  const bgClass = mode === "debate" ? "bg-red-600" : mode === "comedy" ? "bg-yellow-400" : mode === "romance" ? "bg-pink-500" : mode === "god" ? "bg-amber-600" : mode === "mind" ? "bg-gray-950" : "bg-white";
  const textClass = mode === "casual" || mode === "god" ? "text-gray-900" : "text-white";

  const generateImage = async (prompt: string) => {
    setGenLoading(true);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, aspectRatio: "1:1" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const imageUrl = `data:image/jpeg;base64,${data.image}`;
      const caption = `✨ Here's your image: "${prompt}"`;
      setMessages(prev => [...prev, { role: "assistant", content: caption, imageUrl }]);
      return imageUrl;
    } catch { return null; }
    finally { setGenLoading(false); }
  };

  const generateVideo = async (imageUrl: string, prompt: string) => {
    setGenLoading(true);
    try {
      const img = new Image();
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("img load failed"));
        img.src = imageUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 720;
      canvas.height = 720;
      const ctx = canvas.getContext("2d")!;

      const chunks: Blob[] = [];
      const stream = canvas.captureStream(30);
      const recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const videoUrl = URL.createObjectURL(blob);
        setMessages(prev => [...prev, { role: "assistant", content: `🎬 Your AI video for "${prompt}"`, videoUrl }]);
      };
      recorder.start();

      const totalFrames = 60;
      for (let frame = 0; frame < totalFrames; frame++) {
        const progress = frame / totalFrames;
        const zoom = 1 + progress * 0.15;
        const panX = Math.sin(progress * Math.PI * 2) * 20;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "#0b0f19";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const iw = img.width * zoom;
        const ih = img.height * zoom;
        ctx.drawImage(img, (canvas.width - iw) / 2 + panX, (canvas.height - ih) / 2, iw, ih);

        const grad = ctx.createLinearGradient(0, 0, 0, canvas.height);
        grad.addColorStop(0, "rgba(0,0,0,0.4)");
        grad.addColorStop(0.5, "rgba(0,0,0,0)");
        grad.addColorStop(1, "rgba(0,0,0,0.6)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = "rgba(255,255,255,0.8)";
        ctx.font = "bold 28px system-ui";
        ctx.textAlign = "center";
        ctx.fillText("CP Baddie", canvas.width / 2, 60);
        ctx.font = "18px system-ui";
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillText(prompt.substring(0, 50), canvas.width / 2, canvas.height - 40);

        await new Promise((r) => setTimeout(r, 33));
      }
      recorder.stop();
    } catch { }
    finally { setGenLoading(false); }
  };

  const handleLensImage = async (imageData: string) => {
    setLoading(true);
    setError("");
    setResponseText("");
    try {
      const res = await fetch("/api/lens", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: imageData, lang }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "CB Lens failed");
      setResponseText("🔍 CB Lens: " + data.description);
    } catch (err: any) {
      setError(err.message || "CB Lens failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVent = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResponseText("");
    const userMsg: Message = { role: "user", content: text };
    setMessages(prev => [...prev, userMsg]);
    setMessages(prev => [...prev, { role: "assistant", content: "" }]);

    const lower = text.toLowerCase();
    const wantsImage = IMAGE_KEYWORDS.some(k => lower.includes(k));
    const wantsVideo = VIDEO_KEYWORDS.some(k => lower.includes(k));

    try {
      const res = await fetch("/api/chat", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text, mode, lang,
          history: messages.slice(-20).map(m => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error("Stream failed");

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let reply = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") continue;
            try {
              const parsed = JSON.parse(data);
              if (parsed.text) {
                reply += parsed.text;
                setResponseText(reply);
                setMessages(prev => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: reply };
                  return updated;
                });
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch {}
          }
        }
      }

      speakText(reply);

      if (wantsVideo) {
        const prompt = text.replace(/generate video|create video|make video|generate a video|create a video|make a video/gi, "").trim() || text;
        const imgUrl = await generateImage(prompt);
        if (imgUrl) await generateVideo(imgUrl, prompt);
      } else if (wantsImage) {
        const prompt = text.replace(/generate image|create image|make image|draw|generate a picture|make a picture/gi, "").trim() || text;
        await generateImage(prompt);
      }
    } catch (err: any) {
      setError(err.message || "Failed to get response");
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const speakText = async (text: string) => {
    try {
      const clean = text.replace(/[#*_~`\[\]]/g, "").trim();
      if (!clean) return;
      let ok = false;
      try {
        const res = await fetch("/api/edge-tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: clean.substring(0, 500) }),
        });
        if (res.ok) {
          const blob = await res.blob();
          if (blob.size > 0) {
            const url = URL.createObjectURL(blob);
            if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
            audioRef.current = new Audio(url);
            audioRef.current.onended = () => { URL.revokeObjectURL(url); setAiSpeaking(false); };
            audioRef.current.onplay = () => setAiSpeaking(true);
            await audioRef.current.play();
            ok = true;
          }
        }
      } catch { ok = false; }
      if (!ok) {
        // FREE browser speech fallback (works even when ElevenLabs credits run out)
        const synth = (window as any).speechSynthesis;
        if (synth) {
          synth.cancel();
          const u = new SpeechSynthesisUtterance(clean.substring(0, 500));
          u.rate = 1.0;
          u.pitch = 1.05;
          u.onstart = () => setAiSpeaking(true);
          u.onend = () => setAiSpeaking(false);
          u.onerror = () => setAiSpeaking(false);
          synth.speak(u);
        }
      }
    } catch { setAiSpeaking(false); }
  };

  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!authorized) return null;

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${bgClass}`}>
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 pt-6 flex flex-col">
        <div className="mb-3 p-2.5 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="text-[10px] text-green-700">
              <span className="font-semibold">📢 Share & grow the family</span>
              <p className="text-green-500 mt-0.5">{refCount} friends joined ? keep sharing!</p>
            </div>
            <button onClick={() => { navigator.clipboard.writeText(refLink); alert("Link copied!"); }} className="text-[10px] px-3 py-1.5 bg-green-600 text-white rounded-full font-medium hover:bg-green-700 transition-colors">
              📋 Copy
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className={`w-9 h-9 rounded-full bg-gradient-to-br from-pink-400 via-purple-400 to-indigo-400 flex items-center justify-center shadow-lg transition-all duration-300 ${aiSpeaking ? "scale-110" : "scale-100"}`}>
                <span className="text-white text-sm font-bold">AI</span>
              </div>
              {aiSpeaking ? (
                <><span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-ping" /><span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full" /></>
              ) : (
                <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full animate-pulse" />
              )}
            </div>
            <div>
              <h1 className={`text-lg font-semibold tracking-tight ${textClass}`}>
                Prisha Chauhan Chat
              </h1>
              <p className={`text-[10px] ${textClass} opacity-60 flex items-center gap-1`}>
                <span className={`inline-block w-1.5 h-1.5 rounded-full ${aiSpeaking ? "bg-green-400 animate-pulse" : "bg-green-400"}`} />
                {genLoading ? "Generating image..." : aiSpeaking ? "Speaking..." : "AI is live"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {messages.length > 0 && (
              <button onClick={() => {
                if (!confirmDelete) { setConfirmDelete(true); setTimeout(() => setConfirmDelete(false), 3000); return; }
                setConfirmDelete(false); setMessages([]); setResponseText(""); setError("");
              }}
                className={`text-[10px] transition-colors flex items-center gap-1 ${confirmDelete ? "text-red-300" : "text-red-400 hover:text-red-300"}`}>
                {confirmDelete ? "🗑️ Sure?" : `🗑️ ${Math.ceil(messages.length / 2)}`}
              </button>
            )}
            <LanguageSelector selected={lang} onSelect={setLang} />
            <a href="/delete-account" className="text-[9px] text-gray-300 hover:text-red-400 transition-colors" title="Delete account">🗑️</a>
          </div>
        </div>

        <ModalitySwitcher selected={mode} onSelect={(m) => { setMode(m); setResponseText(""); setError(""); setMessages([]); }} />

        <div className="flex-1 flex flex-col mt-4">
          <div className="flex-1 overflow-y-auto mb-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${msg.role === "user" ? "bg-pink-500 text-white rounded-tr-sm" : "bg-gray-100 text-gray-800 rounded-tl-sm"}`}>
                  {msg.content && <div className="whitespace-pre-wrap mb-2">{msg.content}</div>}
                  {msg.videoUrl && (
                    <div>
                      <video src={msg.videoUrl} controls className="w-full rounded-xl" style={{ maxHeight: "300px" }} />
                      <a href={msg.videoUrl} download={`ai-video-${i}.webm`} className="inline-block mt-2 text-[10px] bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700">Download Video</a>
                    </div>
                  )}
                  {msg.imageUrl && (
                    <div>
                      <img src={msg.imageUrl} alt="Generated" className="w-full rounded-xl" style={{ maxHeight: "300px", objectFit: "contain" }} />
                      <div className="flex gap-2 mt-2 flex-wrap">
                        <a href={msg.imageUrl} download={`ai-image-${i}.jpg`} className="text-[10px] bg-gray-800 text-white px-3 py-1 rounded-full hover:bg-gray-700">Download</a>
                        <button onClick={() => generateVideo(msg.imageUrl!, messages[i-1]?.content || "AI image")} className="text-[10px] bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700">🎬 Make Video</button>
                        <button onClick={async () => {
                          const res = await fetch("/api/generate-image", {
                            method: "POST", headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ prompt: messages[i-1]?.content || "image", aspectRatio: "1:1" }),
                          });
                          const data = await res.json();
                          if (res.ok) {
                            const newUrl = `data:image/jpeg;base64,${data.image}`;
                            setMessages(prev => { const u = [...prev]; u[i] = { ...u[i], imageUrl: newUrl }; return u; });
                          }
                        }} className="text-[10px] bg-purple-600 text-white px-3 py-1 rounded-full hover:bg-purple-700">Regenerate</button>
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2 mt-1.5 justify-end">
                    <button onClick={() => { navigator.clipboard.writeText(msg.content || ""); setCopiedIndex(i); setTimeout(() => setCopiedIndex(null), 2000); }} className="text-[10px] opacity-60 hover:opacity-100 transition-opacity">
                      {copiedIndex === i ? "✅" : "Copy"}
                    </button>
                    <button onClick={() => setMessages(prev => prev.filter((_, idx) => idx !== i))} className="text-[10px] opacity-60 hover:opacity-100 hover:text-red-400 transition-opacity">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
            {responseText && !messages.some(m => m.content === responseText) && (
              <div className="w-full my-2">
                <ins className="adsbygoogle" style={{ display: "inline-block", width: "728px", height: "90px" }} data-ad-client="ca-pub-4486222454241909" data-ad-slot="9286475415" />
              </div>
            )}
            {error && <p className="text-xs text-red-400 text-center">{error}</p>}
          </div>
        </div>

        <div className="sticky bottom-0 pb-4 pt-2">
          <VentInput onSubmit={handleVent} disabled={loading || genLoading} onLensImage={handleLensImage} />
        </div>
      </div>
    </div>
  );
}
