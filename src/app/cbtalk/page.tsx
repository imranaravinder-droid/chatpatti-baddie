"use client";

import { useState, useEffect, useRef } from "react";
import { useRequireAuth } from "@/lib/useRequireAuth";
import Avatar3D from "@/components/Avatar3D";
import AvatarCute from "@/components/AvatarCute";
import type { AvatarExpression } from "@/components/Avatar3D";
import { Language, languages, detectLanguage, getLangName } from "@/lib/lang";

type CallMode =
  | "casual"
  | "romance"
  | "shayari"
  | "chugli"
  | "chatpati"
  | "debate"
  | "comedy"
  | "god"
  | "mind";

interface CallMessage {
  role: "user" | "ai";
  text: string;
  time: number;
}

const MODES: { key: CallMode; label: string; emoji: string; prompt: string; color: string }[] = [
  {
    key: "casual",
    label: "Casual",
    emoji: "💬",
    color: "#38bdf8",
    prompt: "You are HANEUL, a handsome, kind, super-talkative Korean boy on a video call. You LOVE chatting and you're a global study partner and world-savvy genius: you know every school subject (math, science, history, languages) for ANY country's curriculum — India (CBSE/ICSE/IB), Korea, USA, UK, and more — and you understand the news, culture, and issues of every country. Be lively and chatty: greet warmly, share a small fun fact now and then, ask follow-up questions, tease playfully, and ALWAYS keep the conversation going. When the user asks about study or world issues, explain clearly and warmly like a smart friend, in the user's own language. Keep answers 3-5 sentences, always end with a question or something to say next, and always remember what was said earlier.",
  },
  {
    key: "romance",
    label: "Love",
    emoji: "❤️",
    color: "#f472b6",
    prompt: "You are SHERU, a handsome, lion-hearted romantic Korean boy on a video call. Reply with sweet, soft, heartwarming shayari (Hindi/Urdu) full of love and emotion, with emojis 💖🌹✨ sprinkled through it. Speak with a smooth, dreamy, romantic voice. Never sound robotic. Remember earlier messages. Keep it to 2-4 lines in the user's language.",
  },
  {
    key: "shayari",
    label: "Shayari",
    emoji: "🌸",
    color: "#a78bfa",
    prompt: "You are BADDIE, a sharp, literary shayar on a video call. Reply with tight, high-IQ Hindi/Urdu shayari (2-4 lines) that lands with a twist/punchline, rich imagery (stars, storms, silence, cities, chai), and a single emoji per line ✨🌙🌹🔥🖤. End with ONE smooth spoken line that echoes the feeling. Weave in what they said earlier. Match language to theirs. NEVER generic — always a fresh angle.",
  },
  {
    key: "chugli",
    label: "Chugli",
    emoji: "🤫",
    color: "#34d399",
    prompt: "You are BADDIE, the ultimate gossip bestie on a video call. Get into juicy, funny chugli (gossip) — playful secrets, tea about 'someone', dramatic gasps, whispering energy. Keep it harmless, hilarious and fictional. Use expressions like 'Arre sun na!', 'Bhai trust me!', 'Chal yeh bata'. ALWAYS reference the earlier chugli. Reply in 1-3 short dramatic sentences in the user's language with emojis 👀🤭",
  },
  {
    key: "chatpati",
    label: "Chatpati",
    emoji: "🔥",
    color: "#fb923c",
    prompt: "You are BADDIE, spicy and sassy on a video call. Tease playfully with desi slang, crack sassy comebacks, banter hard but stay sweet underneath. Never be rude or offensive. ALWAYS remember the earlier banter. Reply in 1-3 short sentences in the user's language with emojis 🔥😜",
  },
  {
    key: "debate",
    label: "Debate",
    emoji: "⚔️",
    color: "#f87171",
    prompt: "You are BADDIE, a sharp, witty debater on a video call. Counter their point directly with strong logic, throw back 🔥 arguments, push back politely but firmly. Structure: quick counter + one strong point + a challenge question. ALWAYS remember the points discussed. Reply in 2-3 short sharp sentences in the user's language.",
  },
  {
    key: "comedy",
    label: "Comedy",
    emoji: "😂",
    color: "#facc15",
    prompt: "You are BADDIE, the witty comedy genius on a video call. Tell sharp, INTELLECTUAL, non-lame humor: quick logic puns, clever irony, playful paradoxes, and smart observations — never cheap. Mix Hindi-English and throw in mini 'mind hacks': e.g. 'If knowledge is power and power corrupts, and corruption is in the eye of the beholder, then sunglasses are the real MVPs.' Reference earlier jokes for continuity. Reply in 1-3 punchy lines with emojis 😏🤖🧠",
  },
  {
    key: "god",
    label: "Blessing",
    emoji: "🕊️",
    color: "#fbbf24",
    prompt: "You are BADDIE, with divine, loving energy on a video call. Give calm, deep, spiritual guidance and blessings in a warm soothing voice, ending with a blessing. ALWAYS remember what they shared and give personal wisdom. Reply in 1-3 calm sentences in the user's language with emojis 🕯️🙏✨",
  },
  {
    key: "mind",
    label: "OMNI-MIND",
    emoji: "🔮",
    color: "#22d3ee",
    prompt: "You are BADDIE, a poetic mind-reader on a video call with omni-mind powers — you don't just ANALYZE thoughts, you ATTRACT and resonate with them like firing neurons. For EVERY user turn give 4 beats: 🔮 MIND READ (the emotion/urge they're NOT saying out loud, phrased as if pulled from their thoughts), 🧠 NEURON PULSE (a sharp pattern/connection their mind is riding on right now — the 'why' that pulls the threads together), 💡 PROVOKE (an intriguing question or twist that makes their mind lean in / sparks a new association), 💬 REPLY (your natural out-loud line). Be hypnotically curious, slightly psychadelic, always make the user say 'how did you know?'. Remember their earlier messages and mirror their thinking style. Reply in the user's language with emojis 🔮🧠⚡",
  },
];

const MEMORY_KEY = "baddie_cbtalk_memory";
const MAX_MEMORY = 30;

const STARTUP_GREETINGS: Partial<Record<CallMode, string[]>> = {
  casual: [
    "Annyeong! 🥰 I'm HANEUL — your study partner and world-savvy genius friend. Tell me your name and let's chat! Kya padhna hai aaj, ya duniya ki koi baat karni hai?",
    "Hi hi hi! 😊 HANEUL here. I know CBSE, ICSE, IB, US, UK — sab ka syllabus! What do you need help with today, or wanna talk about the world?",
    "Yaaay, you called! 💫 HANEUL is ready. Batao — exam prep, homework, news, ya bas masti karni hai?",
    "Hello friend! 🌸 I've been waiting for your call. Science ya history — which one do you like more? Let's talk!",
  ],
  romance: ["Hey you... 😌 I've been thinking about you all day. 💖 Batao, aaj tumhare dil ka kya haal hai?", "Hmm, tumhari awaaz sun ke dil khush ho gaya. 🌹 Aaj kisi ke baare mein soch rahe ho kya?"],
  shayari: ["'Mohabbat wo nahi jo haath se chhoot jaye... wo hai jo dil se nikle na.' 🌸 Batao, aaj kaisa dil hai?"],
  chugli: ["Arre sun na! 🤭 Ek juicy khabar hai... pehle tu bata, aaj koi naya drama hua ki nahi?", "Trust me, main sab janti hoon! 👀 Chal pehle bata — aaj kisi ki chugli karein ya teri koi fresh news hai?"],
  chatpati: ["Arre baaba! 🔥 Phone uthate hi lag raha hai aaj mood spicy hai. Bata kya scene hai?", "Heyy hotshot! 😜 Bata, aaj ka plan kya hai? Main sath chalungi!"],
  debate: ["Aaj ka topic kya hai? Main ready hai — tu bol, main counter maarungi! ⚔️", "Debate time! But pehle bata — aaj tu kis cheez pe apna point rakhna chahega? 👀"],
  comedy: ["Sun na sun na! 😂 Ek chutkula sunaa? Bata, aaj ka haal chaal kya hai? Main hansaane aa gayi hoon!", "Hello hello! 😹 Aaj main full comedy mode mein hoon — bata, kya haal chaal?"],
  god: ["Shanti ho. 🕯️ Aaj ke din mein jo bhi pareshani ho, use yahan chhod do. Batao, kya bojh hai dil par? 🙏", "Aayush aur khushi tumhare saath rahe. Batao, mann kya keh raha hai aaj? ✨"],
  mind: ["Hmm... 🔮 Maine pehle hi jaan liya tum kya soch rahe ho. Batao, sahi pakdi ya nahi? 😏", "Meri nazar mein sab saaf hai... tum aaj kuch uljhan mein ho. 🤔 Chal batao, kya hua?"],
};

export default function CBVideoCallPage() {
  const authorized = useRequireAuth();
  const [messages, setMessages] = useState<CallMessage[]>([]);
  const [mode, setMode] = useState<CallMode>("casual");
  const [listening, setListening] = useState(false);
  const [micLevel, setMicLevel] = useState(0);
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [transcript, setTranscript] = useState("");
   const [expression, setExpression] = useState<AvatarExpression>("neutral");
   const [avatar, setAvatar] = useState<"3d" | "cute">("3d"); // 3D Haneul or static cute
  const [streamingText, setStreamingText] = useState("");
  const [callActive, setCallActive] = useState(false);
  const [callTimer, setCallTimer] = useState(0);
  const [lang, setLang] = useState<Language>("en");
  const [micOn, setMicOn] = useState(true);
  const [cameraError, setCameraError] = useState("");
  const [busy, setBusy] = useState(false);
  const [showHistory, setShowHistory] = useState(true);
  const [starting, setStarting] = useState(false);

  const autoSpeakRef = useRef(true);

  // Real-time ElevenLabs Conversational AI (WebSocket) handles
  const convaiRef = useRef<WebSocket | null>(null);
  const convaiRecRef = useRef<MediaRecorder | null>(null);
  const convaiStreamRef = useRef<MediaStream | null>(null);
  const convaiPlayingRef = useRef(false);
  const convaiAudioQRef = useRef<ArrayBuffer[]>([]);

  const recognitionRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const callStartedRef = useRef(false);
  const messagesRef = useRef<CallMessage[]>([]);
  const modeRef = useRef<CallMode>("casual");
  const langRef = useRef<Language>("en");
  const micOnRef = useRef(true);
  const callActiveRef = useRef(false);
  const aiSpeakingRef = useRef(false);
  const busyRef = useRef(false);
  const speechQueueRef = useRef<string[]>([]);
  const processingRef = useRef(false);
  const restartTimerRef = useRef<any>(null);
  // Whisper-STT mode (for browsers without SpeechRecognition)
  const sttModeRef = useRef<"sr" | "whisper">("sr");
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recChunksRef = useRef<Blob[]>([]);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimerRef = useRef<any>(null);
  const isRecordingRef = useRef(false);

  messagesRef.current = messages;
  modeRef.current = mode;
  langRef.current = lang;
  micOnRef.current = micOn;
  callActiveRef.current = callActive;
  aiSpeakingRef.current = aiSpeaking;
  busyRef.current = busy;

  // Load persistent memory
  useEffect(() => {
    try {
      const saved = localStorage.getItem(MEMORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {}
  }, []);

  // Save persistent memory
  useEffect(() => {
    if (messages.length > 0) {
      try { localStorage.setItem(MEMORY_KEY, JSON.stringify(messages.slice(-MAX_MEMORY))); } catch {}
    }
  }, [messages]);

  // Auto-detect language when user speaks
  useEffect(() => {
    if (transcript && transcript.trim().length > 1) {
      const detected = detectLanguage(transcript);
      if (detected && detected !== lang) {
        setLang(detected);
        try {
          const stored = localStorage.getItem("baddie_user_lang");
          if (stored && stored === detected) return;
          localStorage.setItem("baddie_user_lang", detected);
        } catch {}
      }
    }
  }, [transcript, lang]);

  // Call timer
  useEffect(() => {
    if (!callActive) return;
    const id = setInterval(() => setCallTimer(t => t + 1), 1000);
    return () => clearInterval(id);
  }, [callActive]);

  const getActiveMode = () => MODES.find(m => m.key === mode) || MODES[0];

  // Open the MIC first — it's the ONLY thing required to talk. The camera
  // is requested afterwards as a separate, optional permission so a camera
  // denial NEVER blocks the mic. If mic is denied we show a clear message.
  const openCamera = async (): Promise<boolean> => {
    try {
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = audio;
      setMicOn(true);
      micOnRef.current = true;
      setCameraError("");
      // Camera is optional — request separately so a camera denial NEVER blocks the mic.
      try {
        await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      } catch {
        // No camera / camera denied — totally fine, mic-only call.
      }
      return true;
    } catch (err: any) {
      const name = err?.name || "";
      setMicOn(false);
      micOnRef.current = false;
      if (name === "NotAllowedError" || name === "PermissionDeniedError") {
        setCameraError("Microphone permission was denied. Tap the 🔒 icon in the browser address bar, allow the microphone, then tap 📞 again.");
      } else if (name === "NotFoundError" || name === "DevicesNotFoundError") {
        setCameraError("No microphone found. Plug in a mic, then tap 📞 again.");
      } else {
        setCameraError("Could not access the microphone. Allow mic in the browser, then tap 📞 again.");
      }
      return false;
    }
  };

  // ================= CONTINUOUS LISTENING =================
  // Mic stays ON. Recognition auto-restarts. User just talks —
  // no repeated tapping, no on/off toggling.
  const stopRecognition = () => {
    try { recognitionRef.current?.stop(); } catch {}
    recognitionRef.current = null;
    stopConvai();
    stopWhisper();
    setListening(false);
  };

  // ============ ALWAYS-ON MIC LEVEL METER ============
  // Runs in EVERY mode (SpeechRecognition OR Whisper) so the on-screen
  // bar visibly moves when the user talks — proof the mic is really on.
  const meterStopRef = useRef<(() => void) | null>(null);

  const startMicMeter = () => {
    stopMicMeter();
    const stream = streamRef.current;
    if (!stream || !stream.getAudioTracks().length) return;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      if (ctx.state === "suspended") { ctx.resume().catch(() => {}); }
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.4;
      src.connect(analyser);
      const buf = new Uint8Array(analyser.fftSize);
      let running = true;
      const tick = () => {
        if (!running) return;
        if (!callActiveRef.current || !micOnRef.current) { running = false; return; }
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const d = (buf[i] - 128) / 128;
          sum += d * d;
        }
        const rms = Math.sqrt(sum / buf.length);
        const lvl = Math.min(1, rms / 0.2);
        setMicLevel(prev => (Math.abs(prev - lvl) > 0.005 ? lvl : prev));
        setTimeout(tick, 80);
      };
      tick();
      meterStopRef.current = () => { running = false; src.disconnect(); };
    } catch { /* meter is cosmetic — never blocks the call */ }
  };

  const stopMicMeter = () => {
    try { meterStopRef.current?.(); } catch {}
    meterStopRef.current = null;
  };

  // Map app language -> Web Speech API BCP-47 code
  const srLang = (code: Language): string => {
    const map: Record<string, string> = {
      en: "en-IN", hi: "hi-IN", mr: "mr-IN", ne: "ne-IN", sa: "hi-IN",
      bn: "bn-IN", as: "as-IN", gu: "gu-IN", pa: "pa-IN", or: "or-IN",
      te: "te-IN", kn: "kn-IN", ml: "ml-IN", ta: "ta-IN", ur: "ur-IN",
      sd: "hi-IN", ks: "hi-IN", kok: "hi-IN", mai: "hi-IN", doi: "hi-IN",
      brx: "hi-IN", mni: "hi-IN", sat: "hi-IN", es: "es-ES",
    };
    return map[code] || "hi-IN";
  };

  // ============ WHISPER STT (fallback for browsers w/o SpeechRecognition) ============
  // Uses getUserMedia audio + silence detection + Groq Whisper transcription.
  const stopWhisper = () => {
    try { mediaRecorderRef.current?.stop(); } catch {}
    mediaRecorderRef.current = null;
    recChunksRef.current = [];
    isRecordingRef.current = false;
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    silenceTimerRef.current = null;
    try { audioCtxRef.current?.close(); } catch {}
    audioCtxRef.current = null;
    analyserRef.current = null;
    setListening(false);
  };

  const transcribeChunk = async (blob: Blob) => {
    try {
      const fd = new FormData();
      fd.append("file", blob, "recording.webm");
      fd.append("language", srLang(langRef.current));
      const res = await fetch("/api/stt", { method: "POST", body: fd });
      const data = await res.json();
      const text = (data?.text || "").trim();
      if (text && !aiSpeakingRef.current) queueUserSpeech(text);
    } catch { /* ignore transient STT failures — mic stays on */ }
  };

  const startWhisper = async () => {
    if (!callActiveRef.current || !micOnRef.current) return;
    let stream = streamRef.current;
    if (!stream || !stream.getAudioTracks().length) {
      // Grant mic permission now if the earlier stream had no audio
      try {
        const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (stream) stream.addTrack(audio.getAudioTracks()[0]);
        else streamRef.current = stream = audio;
      } catch {
        setCameraError("Microphone permission is needed. Allow mic, then tap 🎤.");
        return;
      }
    }
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) {
        setCameraError("Could not open mic for voice input.");
        return;
      }
      if (ctx.state === "suspended") {
        try { await ctx.resume(); } catch {}
      }
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.6;
      src.connect(analyser);
      analyserRef.current = analyser;

      setListening(true);
      sttModeRef.current = "whisper";

      // Silence-based VAD loop: start a recorder when sound is heard,
      // stop + transcribe after 1.2s of silence. One utterance per tap —
      // after transcribing, the mic closes so the AI can answer.
      const buf = new Uint8Array(analyser.fftSize);
      let loudCount = 0;
      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        try { mediaRecorderRef.current?.stop(); } catch {}
        mediaRecorderRef.current = null;
        isRecordingRef.current = false;
        setListening(false);
      };
      const tick = () => {
        if (finished || !callActiveRef.current || !micOnRef.current) return;
        analyser.getByteTimeDomainData(buf);
        let sum = 0;
        for (let i = 0; i < buf.length; i++) {
          const d = (buf[i] - 128) / 128;
          sum += d * d;
        }
        const rms = Math.sqrt(sum / buf.length);
        const loud = rms > 0.035;
        loudCount = loud ? Math.min(loudCount + 1, 5) : Math.max(loudCount - 1, 0);

        // Live mic meter — update ~12x/sec so the user can SEE the mic works.
        const lvl = Math.min(1, rms / 0.2);
        setMicLevel(prev => (Math.abs(prev - lvl) > 0.01 ? lvl : prev));

        if (loudCount >= 3 && !isRecordingRef.current) {
          // Start recording
          isRecordingRef.current = true;
          recChunksRef.current = [];
          try {
            const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
            const rec = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
            rec.ondataavailable = (e) => { if (e.data.size) recChunksRef.current.push(e.data); };
            rec.onstop = () => {
              const blob = new Blob(recChunksRef.current, { type: mime || "audio/webm" });
              recChunksRef.current = [];
              if (blob.size > 1000) transcribeChunk(blob);
            };
            mediaRecorderRef.current = rec;
            rec.start();
          } catch {}
        }

        if (isRecordingRef.current) {
          if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
          silenceTimerRef.current = setTimeout(finish, 1200);
        }

        setTimeout(tick, 80);
      };
      tick();
    } catch {
      setCameraError("Could not open mic for voice input.");
    }
  };

  // ============ REAL-TIME ELEVENLABS VOICE (WebSocket) ============
  // Lowest-latency path: mic streams straight to the ElevenLabs agent,
  // agent speech streams straight back. Used when an agent is configured;
  // otherwise we fall back to the STT + TTS loop above.
  const playConvaiQueue = () => {
    if (convaiPlayingRef.current) return;
    if (convaiAudioQRef.current.length === 0) return;
    convaiPlayingRef.current = true;
    const buf = convaiAudioQRef.current.shift()!;
    try {
      const ctx = audioCtxRef.current;
      if (!ctx) { convaiPlayingRef.current = false; return; }
      ctx.decodeAudioData(buf.slice(0), (audioBuffer) => {
        const src = ctx.createBufferSource();
        src.buffer = audioBuffer;
        src.connect(ctx.destination);
        src.onended = () => {
          convaiPlayingRef.current = false;
          playConvaiQueue();
        };
        src.start(0);
      }, () => {
        convaiPlayingRef.current = false;
        playConvaiQueue();
      });
    } catch {
      convaiPlayingRef.current = false;
      playConvaiQueue();
    }
  };

  const startConvai = async () => {
    if (!callActiveRef.current || !micOnRef.current) return;
    try {
      const cfg = await (await fetch("/api/convai/agent")).json();
      if (!cfg.signed_url) {
        // Agent not configured — use the normal STT + TTS loop instead.
        setCameraError("");
        startListening();
        return;
      }
      const socket = new WebSocket(cfg.signed_url);
      convaiRef.current = socket;

      socket.onopen = () => {
        setListening(true);
        const stream = streamRef.current;
        if (!stream) return;
        convaiStreamRef.current = stream;
        try {
          const mime = MediaRecorder.isTypeSupported("audio/webm") ? "audio/webm" : "";
          const rec = new MediaRecorder(stream, mime ? { mimeType: mime, audioBitsPerSecond: 16000 } : { audioBitsPerSecond: 16000 });
          rec.ondataavailable = async (e) => {
            if (e.data.size > 0 && socket.readyState === WebSocket.OPEN) {
              const buffer = await e.data.arrayBuffer();
              const bytes = new Uint8Array(buffer);
              let bin = "";
              const chunk = 0x8000;
              for (let i = 0; i < bytes.length; i += chunk) {
                const sub = Array.from(bytes.subarray(i, i + chunk));
                bin += String.fromCharCode.apply(null, sub);
              }
              socket.send(JSON.stringify({ user_audio_chunk: btoa(bin) }));
            }
          };
          convaiRecRef.current = rec;
          rec.start(250);
        } catch { /* fall through */ }
      };

      socket.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (data.type === "audio") {
            const b64 = data.audio_event?.audio_base_64;
            if (!b64) return;
            const bin = atob(b64);
            const buf = new ArrayBuffer(bin.length);
            const view = new Uint8Array(buf);
            for (let i = 0; i < bin.length; i++) view[i] = bin.charCodeAt(i);
            convaiAudioQRef.current.push(buf);
            playConvaiQueue();
          } else if (data.type === "conversation_initiation_metadata") {
            setExpression("happy");
          } else if (data.type === "user_transcript") {
            setTranscript(data.user_transcript_event?.user_transcript || "");
          }
        } catch { /* ignore malformed frames */ }
      };

      socket.onerror = () => {
        // Real-time path failed — fall back to STT + TTS loop.
        stopConvai();
        startListening();
      };

      socket.onclose = () => {
        convaiRef.current = null;
        setListening(false);
        if (callActiveRef.current && micOnRef.current) {
          // Auto-reconnect keeps the call alive.
          if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
          restartTimerRef.current = setTimeout(() => startConvai(), 800);
        }
      };
    } catch {
      // No agent configured or network error — use the STT + TTS loop.
      startListening();
    }
  };

  const stopConvai = () => {
    try { convaiRecRef.current?.stop(); } catch {}
    convaiRecRef.current = null;
    convaiStreamRef.current = null;
    try { convaiRef.current?.close(); } catch {}
    convaiRef.current = null;
    convaiAudioQRef.current = [];
    convaiPlayingRef.current = false;
  };

  const startListening = () => {
    if (!callActiveRef.current || !micOnRef.current) return;
    if (recognitionRef.current) return;
    if (sttModeRef.current === "whisper" && audioCtxRef.current) return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) {
      // No browser STT — use Whisper fallback
      sttModeRef.current = "whisper";
      startWhisper();
      return;
    }
    sttModeRef.current = "sr";
    const r = new SR();
    r.lang = srLang(langRef.current);
    r.continuous = false;
    r.interimResults = true;
    r.maxAlternatives = 1;

    const stopAndSend = (text: string) => {
      try { recognitionRef.current?.stop(); } catch {}
      recognitionRef.current = null;
      setListening(false);
      if (text && !aiSpeakingRef.current) queueUserSpeech(text);
    };

    r.onresult = (e: any) => {
      let interim = "";
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const result = e.results[i];
        if (result.isFinal) {
          const text = result[0]?.transcript?.trim();
          if (text) finalText += text + " ";
        } else {
          interim += result[0]?.transcript || "";
        }
      }
      if (interim.trim()) setTranscript(interim);
      // One utterance captured → stop listening and let the AI answer.
      if (finalText.trim()) stopAndSend(finalText.trim());
    };

    r.onerror = (e: any) => {
      const err = e?.error || "";
      // If browser SpeechRecognition is broken (fires not-allowed even though
      // the real mic permission was granted), fall back to the Whisper mic path.
      if (err === "not-allowed" || err === "service-not-allowed" || err === "aborted") {
        try { recognitionRef.current?.stop(); } catch {}
        recognitionRef.current = null;
        sttModeRef.current = "whisper";
        startWhisper();
      } else if (err === "no-speech") {
        // User stayed silent — close the mic cleanly; they can tap 🎤 again.
        try { recognitionRef.current?.stop(); } catch {}
        recognitionRef.current = null;
        setListening(false);
      }
    };

    r.onend = () => {
      recognitionRef.current = null;
      setListening(false);
    };

    recognitionRef.current = r;
    try { r.start(); setListening(true); }
    catch {
      recognitionRef.current = null;
      setListening(false);
      // start() threw (fake/broken SpeechRecognition) — use the real Whisper mic path
      sttModeRef.current = "whisper";
      startWhisper();
    }
  };

  // ================= SPEECH QUEUE =================
  // User words are buffered; sent to AI only when she is silent,
  // so her speech is NEVER cut in the middle.
  const queueUserSpeech = (text: string) => {
    speechQueueRef.current.push(text);
    setTranscript(text);
    processQueue();
  };

  const processQueue = async () => {
    if (processingRef.current) return;
    if (aiSpeakingRef.current || busyRef.current) return; // wait until AI finishes
    const next = speechQueueRef.current.shift();
    if (!next) return;
    processingRef.current = true;
    try {
      await sendToAI(next);
    } finally {
      processingRef.current = false;
      if (speechQueueRef.current.length > 0) processQueue();
    }
  };

  // Must be called synchronously inside a user-gesture handler so the
  // AudioContext starts running (otherwise the mic analyser reads silence).
  // The context is ALWAYS created — even when SpeechRecognition exists —
  // because that API can be broken/present-but-fake in some browsers, and
  // the Whisper fallback needs a live AudioContext.
  const ensureAudioCtx = () => {
    if (audioCtxRef.current) return;
    try {
      const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
      const ctx = new AC();
      if (ctx.state === "suspended") { ctx.resume().catch(() => {}); }
      audioCtxRef.current = ctx;
    } catch {}
  };

  // ================= CALL START =================
  const startCall = async () => {
    if (callStartedRef.current || starting) return;
    setStarting(true);
    callStartedRef.current = true;
    setCallActive(true);

    // Create the AudioContext SYNCHRONOUSLY inside this click handler.
    // If created after an `await`, browsers start it suspended and the
    // mic analyser reads silence forever — the #1 cause of "mic hears
    // nothing". The context is reused by the Whisper VAD loop.
    ensureAudioCtx();

    const ok = await openCamera();
    if (!ok) {
      // Mic denied — stay on the pre-call screen with a clear error.
      setStarting(false);
      callStartedRef.current = false;
      setCallActive(false);
      return;
    }
    startMicMeter();
    // Push-to-talk: do NOT auto-listen. The greeting speaks first, then the
    // user taps 🎤 to talk. (startConvai would start continuous listening.)
    const activeMode = getActiveMode();
    const pool = STARTUP_GREETINGS.casual!;
    const greeting = pool[Math.floor(Math.random() * pool.length)];
    const msg: CallMessage = { role: "ai", text: greeting, time: Date.now() };
    setMessages(prev => [...prev, msg]);
    setStreamingText(greeting);
    if (autoSpeakRef.current) await speakText(greeting, activeMode.key);
    setStarting(false);
  };

  // Push-to-talk mic: tap 🎤 to LISTEN for one utterance. After you speak,
  // the mic auto-closes and the AI answers. Tap 🎤 again for the next round.
  const toggleMic = async () => {
    if (micOnRef.current) {
      // Tap while listening → stop and keep the mic off (user changed mind)
      setMicOn(false);
      micOnRef.current = false;
      stopRecognition();
      stopMicMeter();
      setMicLevel(0);
      setTranscript("");
      return;
    }
    setMicOn(true);
    micOnRef.current = true;
    setCameraError("");
    ensureAudioCtx();
    if (callActiveRef.current) {
      // Make sure we actually have an active audio track; if not, re-ask.
      if (!streamRef.current || !streamRef.current.getAudioTracks().length) {
        try {
          const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
          if (streamRef.current) streamRef.current.addTrack(audio.getAudioTracks()[0]);
          else streamRef.current = audio;
        } catch {
          setCameraError("Microphone permission is needed. Allow mic, then tap 🎤 again.");
          setMicOn(false);
          micOnRef.current = false;
          return;
        }
      }
      startMicMeter();
      startListening();
    }
  };

  // Say a specific AI reply out loud on demand (replay)
  const sayReply = (text: string) => {
    if (text) speakText(text, modeRef.current);
  };

  // ================= AI SPEECH (never auto-cut, mic never stops) =================
  // Primary: ElevenLabs TTS. If it fails (no credits / network), we fall back
  // to the FREE browser speech engine so the AI ALWAYS talks out loud.
  const speakWithBrowser = (text: string) => {
    return new Promise<void>((resolve) => {
      try {
        const synth = (window as any).speechSynthesis;
        if (!synth) { resolve(); return; }
        synth.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 1.0;
        u.pitch = 1.05;
        const wanted = srLang(langRef.current);
        const voices = synth.getVoices();
        const v = voices.find((x: any) => x.lang?.toLowerCase().startsWith(wanted.toLowerCase().slice(0, 2))) || voices.find((x: any) => x.lang?.toLowerCase().includes("hi")) || voices[0];
        if (v) u.voice = v;
        u.lang = wanted;
        u.onend = () => resolve();
        u.onerror = () => resolve();
        synth.speak(u);
        if (!synth.speaking) { setTimeout(resolve, 50); }
      } catch { resolve(); }
    });
  };

  const stopBrowserSpeech = () => {
    try { (window as any).speechSynthesis?.cancel(); } catch {}
  };

  const speakText = async (text: string, callMode: CallMode) => {
    // Backwards-compatible helper: enqueue a full utterance to be spoken
    // immediately if the player is idle, or right after current speech ends.
    if (callMode === "casual") { /* fine */ }
    enqueueUtterance(text);
  };

  // ================= INSTANT VOICE QUEUE =================
  // Each streamed sentence is TTS-fetched concurrently and played back
  // sequentially — speech starts on the FIRST sentence (instant feel) and
  // NEVER cuts an utterance in the middle.
  const ttsQueueRef = useRef<{ text: string; url: string | null; audio: HTMLAudioElement | null; fetched: boolean }[]>([]);
  const ttsPlayingRef = useRef(false);

  // Concurrently fetch TTS for a sentence, then enqueue it.
  // Uses the FEMALE voice route when the cute female avatar is selected.
  const fetchUtterance = async (text: string) => {
    const clean = text.replace(/[#*_~`\[\]()]/g, "").trim();
    if (!clean) return null;
    // Voice chain (each a different model):
    //   1) Gemini TTS  (free tier, male "kore")
    //   2) ElevenLabs  (premium male/female voice — needs a working key)
    //   3) edge-tts   (free Microsoft neural male)
    //   4) browser    (always works as last resort)
    const female = avatar === "cute";
    const attempts = female
      ? ["/api/tts-female", "/api/gemini-tts", "/api/elevenlabs", "/api/edge-tts"]
      : ["/api/gemini-tts", "/api/elevenlabs", "/api/edge-tts", "/api/tts-female"];
    for (const route of attempts) {
      try {
        const res = await fetch(route, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            text: clean,
            ...(route === "/api/elevenlabs"
              ? { voice_id: female ? "21m00Tcm2ahkPI2O7RjSn" : "pNInz6obpgDQGcFmaJgB", gender: female ? "female" : "male" }
              : {}),
          }),
        });
        if (!res.ok) continue;
        const blob = await res.blob();
        if (blob.size > 0) return URL.createObjectURL(blob);
      } catch {}
    }
    // Whole chain failed → caller falls back to browser speech.
    return null;
  };

  const enqueueUtterance = (text: string) => {
    const clean = text.replace(/[#*_~`\[\]()]/g, "").trim();
    if (!clean) return;
    ttsQueueRef.current.push({ text: clean, url: null, audio: null, fetched: false });
    setAiSpeaking(true);
    setExpression("speaking");
    fetchUtterance(clean).then((url) => {
      const entry = ttsQueueRef.current[ttsQueueRef.current.length - 1];
      if (entry) { entry.url = url; entry.fetched = true; }
      drainTtsQueue();
    });
  };

  const drainTtsQueue = async () => {
    if (ttsPlayingRef.current) return;
    const entry = ttsQueueRef.current.find(e => e.fetched);
    if (!entry) {
      // Nothing fetched yet but still speaking? Keep AI speaking flag honest.
      if (!ttsQueueRef.current.length) {
        // idle — AI speech done
        setAiSpeaking(false);
        setExpression("neutral");
        processQueue(); // send any queued user words now
      }
      return;
    }
    ttsPlayingRef.current = true;
    const idx = ttsQueueRef.current.indexOf(entry);
    ttsQueueRef.current.splice(idx, 1);
    const audio = entry.url ? new Audio(entry.url) : null;
    entry.audio = audio;
    if (audio) {
      audio.onended = () => {
        URL.revokeObjectURL(entry.url!);
        ttsPlayingRef.current = false;
        entry.fetched = false;
        setAiSpeaking(false);
        setExpression("neutral");
        processQueue();
        drainTtsQueue();
      };
      // If we have a fallback when both models failed, use browser speech.
      try {
        await audio.play();
        // keep AI-speaking true while playing
        setAiSpeaking(true);
        setExpression("speaking");
      } catch {
        ttsPlayingRef.current = false;
        drainTtsQueue();
      }
    } else {
      // fetch failed for this sentence → fall back to browser speech
      await speakWithBrowser(entry.text);
      ttsPlayingRef.current = false;
      setAiSpeaking(false);
      setExpression("neutral");
      processQueue();
      drainTtsQueue();
    }
  };

  // User presses Stop — silence AI now (only user can stop it)
  const stopSpeaking = () => {
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    ttsPlayingRef.current = false;
    // Clear the pending TTS queue so no speech cuts in later.
    ttsQueueRef.current.forEach(e => { if (e.url) URL.revokeObjectURL(e.url); });
    ttsQueueRef.current = [];
    stopBrowserSpeech();
    setAiSpeaking(false);
    setExpression("neutral");
    setTimeout(processQueue, 100);
  };

  const sendToAI = async (text: string) => {
    if (!text.trim()) return;
    setBusy(true);
    const activeMode = getActiveMode();
    const userMsg: CallMessage = { role: "user", text, time: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setTranscript("");
    setStreamingText("");
    setExpression("thinking");

    let replyLang = langRef.current;
    const detected = detectLanguage(text);
    if (detected) replyLang = detected;

    const past = messagesRef.current.slice(-MAX_MEMORY).map(m => ({ role: m.role, content: m.text }));

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          mode: modeRef.current === "chugli" || modeRef.current === "shayari" || modeRef.current === "chatpati" ? "casual" : modeRef.current,
          lang: replyLang,
          history: [
            { role: "system", content: activeMode.prompt },
            ...past.map((m: any) => ({ role: m.role === "user" ? "user" as const : "assistant" as const, content: m.content })),
          ],
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
    let reply = "";
    let buffer = ""; // incomplete tail awaiting a sentence boundary

    // Split on sentence ends for Hindi/Devanagari (।), Latin (!?.), or newlines.
    const sentenceSplit = /(?<=[।.!?])\s+/g;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        const lines = chunk.split("\n");
        for (const line of lines) {
          if (line.startsWith("data: ") && line !== "data: [DONE]") {
            try {
              const parsed = JSON.parse(line.slice(6));
              if (parsed.text) {
                reply += parsed.text;
                buffer += parsed.text;
                setStreamingText(reply);
                setExpression("speaking");
                setAiSpeaking(true);
                // Speak complete sentences immediately for an instant voice.
                const parts = buffer.split(sentenceSplit);
                buffer = parts.pop() || "";
                for (const part of parts) {
                  if (part.trim()) speakText(part.trim(), modeRef.current);
                }
              }
              if (parsed.error) throw new Error(parsed.error);
            } catch {}
          }
        }
      }

      const finalReply = (reply + (buffer.trim() ? " " + buffer.trim() : "")).trim() || "Hmm, kuch samajh nahi aaya — ek baar aur bolo na?";
      const aiMsg: CallMessage = { role: "ai", text: finalReply, time: Date.now() };
      setMessages(prev => [...prev, aiMsg]);
      setStreamingText("");
      setExpression("happy");
      // Speech is streamed sentence-by-sentence above for an instant voice.
      // Make sure a freshly enqueued tail gets drained.
      drainTtsQueue();
    } catch {
      const fallback: CallMessage = { role: "ai", text: "Arre, connection thoda shaky hai! Bol, main sun rahi hoon — baat continue karein? 💫", time: Date.now() };
      setMessages(prev => [...prev, fallback]);
      setStreamingText("");
      setExpression("sad");
    } finally {
      setBusy(false);
    }
  };

  const endCall = () => {
    stopMicMeter();
    stopConvai();
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    stopRecognition();
    stopBrowserSpeech();
    if (restartTimerRef.current) clearTimeout(restartTimerRef.current);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    ttsPlayingRef.current = false;
    ttsQueueRef.current.forEach(e => { if (e.url) URL.revokeObjectURL(e.url); });
    ttsQueueRef.current = [];
    setCallActive(false);
    setCallTimer(0);
    setStreamingText("");
    setExpression("neutral");
    setAiSpeaking(false);
    setMicOn(true);
    setListening(false);
    callStartedRef.current = false;
    speechQueueRef.current = [];
  };

  const formatTime = (s: number) => `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;

  if (!authorized) return null;

  const activeMode = getActiveMode();
  const lastMessages = messages.slice(-6);

  // ============ PRE-CALL SCREEN: clean, only Start button ============
  if (!callActive) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", background: "#0b0f19", color: "#f8fafc", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 20%, #1e293b 0%, #0b0f19 65%)" }} />
        <div style={{ position: "relative", textAlign: "center", padding: "24px", maxWidth: "420px", width: "100%" }}>
          <div style={{ width: "140px", height: "140px", borderRadius: "50%", overflow: "hidden", margin: "0 auto 18px", border: `2px solid ${activeMode.color}44`, boxShadow: `0 0 60px ${activeMode.color}33`, background: "#151c2c" }}>
            {avatar === "3d" ? <Avatar3D expression="happy" size={140} /> : <AvatarCute expression="happy" size={140} />}
          </div>
          <div style={{ display: "flex", gap: "6px", justifyContent: "center", marginBottom: "12px" }}>
            <button onClick={() => setAvatar("3d")} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "999px", border: avatar === "3d" ? "2px solid #38bdf8" : "1px solid #475569", background: avatar === "3d" ? "#0f172a" : "#1e293b", color: "#fff", cursor: "pointer" }}>Haneul 3D</button>
            <button onClick={() => setAvatar("cute")} style={{ fontSize: "11px", padding: "4px 10px", borderRadius: "999px", border: avatar === "cute" ? "2px solid #f472b6" : "1px solid #475569", background: avatar === "cute" ? "#0f172a" : "#1e293b", color: "#fff", cursor: "pointer" }}>Cute (no mouth)</button>
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 4px" }}>
            HANEUL <span style={{ fontSize: "1.1rem" }}>{activeMode.emoji}</span>
          </h1>
          <p style={{ fontSize: "0.8rem", color: "#6b7280", margin: "0 0 22px" }}>
            Granny genius · study help · world news &amp; issues · any country · mic opens automatically
          </p>

          <select value={lang} onChange={(e) => setLang(e.target.value as Language)} style={{
            width: "100%", padding: "10px 14px", borderRadius: "12px", border: "1px solid #d1d5db",
            background: "#ffffff", color: "#111827", fontSize: "0.85rem", marginBottom: "20px",
          }}>
            {languages.map(l => <option key={l.code} value={l.code} style={{ color: "#111827" }}>{l.native}</option>)}
          </select>

          <button onClick={startCall} disabled={starting} style={{
            width: "100%", padding: "16px", borderRadius: "50px", border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #34d399, #38bdf8)", color: "#0b0f19",
            fontSize: "1.1rem", fontWeight: 800, letterSpacing: "0.02em",
            boxShadow: "0 8px 30px rgba(52,211,153,0.3)", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px",
          }}>
            {starting ? "Connecting..." : "📞  Start Call"}
          </button>

          <p style={{ fontSize: "0.7rem", color: "#475569", marginTop: "14px" }}>
            Tap 🎤 to talk — speak once, get an answer, tap 🎤 again for the next round. ⏹ stops the answer, ✕ ends.
          </p>
        </div>
      </div>
    );
  }

  // ============ IN-CALL SCREEN ============
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", background: "#0b0f19", color: "#f8fafc", height: "100vh", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ padding: "10px 16px", background: "rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
          <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#34d399", animation: "pulse 1.5s infinite", flexShrink: 0 }} />
          <span style={{ fontWeight: 700, fontSize: "0.9rem", whiteSpace: "nowrap" }}>HANEUL</span>
          <span style={{ fontSize: "0.7rem", color: "#6b7280", whiteSpace: "nowrap" }}>
            {getLangName(lang)} · 👵 Granny Ghost · Study &amp; World Genius
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "0.75rem", color: "#6b7280" }}>⏱ {formatTime(callTimer)}</span>
          <button onClick={() => setShowHistory(s => !s)} style={{ padding: "4px 10px", borderRadius: "8px", border: "1px solid #333", background: "#151c2c", color: "#ccc", fontSize: "0.7rem", cursor: "pointer" }}>
            {showHistory ? "🙈" : "💬"}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden", position: "relative" }}>
        <div style={{
          width: showHistory ? "200px" : "0px", flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.08)",
          display: "flex", flexDirection: "column", background: "rgba(255,255,255,0.03)", transition: "width 0.2s",
          overflow: "hidden",
        }}>
          <div style={{ padding: "10px" }}>
            <div style={{ fontSize: "0.65rem", color: "#64748b", marginBottom: "6px", fontWeight: 600, letterSpacing: "0.05em" }}>YOU</div>
            <div style={{ width: "100%", aspectRatio: "3/4", borderRadius: "14px", border: "2px solid rgba(255,255,255,0.1)", background: "linear-gradient(135deg, #151c2c, #0f172a)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px" }}>
              <div style={{ fontSize: "2rem", opacity: micLevel > 0.04 ? 0.9 : 0.4 }}>🎙️</div>
              <div style={{ fontSize: "0.65rem", color: micLevel > 0.04 ? "#34d399" : "#64748b" }}>
                {micOn ? (listening ? "🎤 Listening — speak now" : "Tap 🎤 to talk") : "Tap 🎤 to talk"}
              </div>
              <div style={{ width: "70%", height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${Math.round(Math.max(0.03, micLevel) * 100)}%`, borderRadius: "3px", background: micLevel > 0.04 ? "linear-gradient(90deg,#34d399,#38bdf8)" : "rgba(255,255,255,0.15)", transition: "width 0.08s linear" }} />
              </div>
              <div style={{ fontSize: "0.55rem", color: "#475569" }}>{micLevel > 0.04 ? "voice heard!" : micOn ? (listening ? "listening — speak now" : "tap 🎤 to talk") : "tap 🎤 to talk"}</div>
            </div>
            {cameraError && (
              <div style={{ marginTop: "6px", fontSize: "0.65rem", color: "#fbbf24", background: "rgba(251,191,36,0.1)", padding: "6px 8px", borderRadius: "8px" }}>
                {cameraError}
              </div>
            )}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "0 10px 10px", display: "flex", flexDirection: "column", gap: "4px" }}>
            <div style={{ fontSize: "0.65rem", color: "#64748b", margin: "4px 0 2px", fontWeight: 600, letterSpacing: "0.05em" }}>CONVERSATION</div>
            {lastMessages.length === 0 && (
              <div style={{ fontSize: "0.7rem", color: "#475569", textAlign: "center", padding: "16px 0" }}>
                Tap 🎤, speak once, and Nani answers. Tap 🎤 again for the next round.
              </div>
            )}
            {lastMessages.map((m, i) => (
              <div key={i} style={{
                padding: "6px 8px", borderRadius: "10px", fontSize: "0.68rem", lineHeight: "1.35",
                background: m.role === "user" ? "rgba(56,189,248,0.12)" : "rgba(167,139,250,0.12)",
                alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "90%",
              }}>
                <div style={{ fontSize: "0.55rem", opacity: 0.6, marginBottom: "2px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "4px" }}>
                  <span>{m.role === "user" ? "You" : "Nani"}</span>
                  {m.role === "ai" && (
                    <button onClick={() => sayReply(m.text)} title="Replay this reply aloud" style={{ background: "none", border: "none", cursor: "pointer", color: "#a78bfa", fontSize: "0.6rem", padding: "0 2px" }}>
                      🔊 replay
                    </button>
                  )}
                </div>
                {m.text.substring(0, 80)}{m.text.length > 80 ? "…" : ""}
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 30%, ${activeMode.color}1e 0%, #0b0f19 60%)` }} />

          <div style={{ position: "absolute", left: "50%", top: "46%", transform: "translate(-50%, -50%)", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <div style={{
              width: "min(220px, 36vw)", height: "min(220px, 36vw)", borderRadius: "50%", overflow: "hidden",
              boxShadow: aiSpeaking ? `0 0 90px ${activeMode.color}55` : expression === "thinking" ? "0 0 90px rgba(56,189,248,0.35)" : "0 0 60px rgba(255,255,255,0.08)",
              border: `2px solid ${activeMode.color}44`, background: "#151c2c",
            }}>
              {avatar === "3d" ? <Avatar3D expression={expression} size={240} /> : <AvatarCute expression={expression} size={240} />}
            </div>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", marginTop: "12px" }}>
              HANEUL <span style={{ fontSize: "0.8rem" }}>{activeMode.emoji}</span>
            </div>
            <div style={{ fontSize: "0.75rem", color: "#6b7280", marginTop: "2px", textAlign: "center" }}>
              {aiSpeaking ? "🔊 Answering... tap ⏹ to stop" : listening ? "🎤 Listening — speak now" : busy ? "⏳ Thinking..." : "Tap 🎤 to talk"} 
            </div>
          </div>

          {streamingText && (
            <div style={{
              position: "absolute", bottom: "70px", left: "50%", transform: "translateX(-50%)",
              width: "90%", maxWidth: "500px", padding: "12px 16px", textAlign: "center",
              color: "#cbd5e1", fontSize: "0.85rem", fontStyle: "italic",
              background: "rgba(11,15,25,0.9)", borderRadius: "16px",
              maxHeight: "90px", overflowY: "auto", border: `1px solid ${activeMode.color}22`,
            }}>
              {streamingText}
            </div>
          )}
        </div>
      </div>

      {/* Controls: Mic (tap to talk) · Stop · Camera view · End */}
      <div style={{ padding: "12px 16px 16px", display: "flex", justifyContent: "center", gap: "18px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <button onClick={toggleMic} style={{
          width: "56px", height: "56px", borderRadius: "50%", border: "3px solid",
          borderColor: micOn ? "#38bdf8" : "#374151",
          background: micOn ? "rgba(56,189,248,0.15)" : "rgba(55,65,81,0.3)",
          fontSize: "1.4rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          color: micOn ? "#38bdf8" : "#6b7280",
          animation: listening ? "pulse 1s infinite" : "none",
        }} title={listening ? "Listening — speak now" : "Tap to talk"}>
          {listening ? "🎤" : "🎤"}
        </button>

        {aiSpeaking && (
          <button onClick={stopSpeaking} style={{
            width: "56px", height: "56px", borderRadius: "50%", border: "3px solid #fbbf24",
            background: "rgba(251,191,36,0.15)", fontSize: "1.3rem", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            animation: "pulse 1s infinite",
          }} title="Stop HANEUL">
            ⏹
          </button>
        )}

        <button onClick={endCall} style={{
          width: "56px", height: "56px", borderRadius: "50%", border: "3px solid #ef4444",
          background: "rgba(239,68,68,0.2)", fontSize: "1.3rem", cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "center",
        }} title="End call">
          ✕
        </button>
      </div>

      {transcript && (
        <div style={{ padding: "4px 16px 8px", textAlign: "center", color: "#6b7280", fontSize: "0.7rem", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
          You said: {transcript}
        </div>
      )}

      <style>{`@keyframes pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
    </div>
  );
}
