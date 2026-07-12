export type Language =
  | "en" | "hi" | "mr" | "ne" | "sa"
  | "bn" | "as" | "gu" | "pa" | "or"
  | "te" | "kn" | "ml" | "ta" | "ur"
  | "sd" | "ks" | "kok" | "mai" | "doi"
  | "brx" | "mni" | "sat" | "es";

export const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "EN", native: "English" },
  { code: "hi", label: "HI", native: "हिन्दी" },
  { code: "mr", label: "MR", native: "मराठी" },
  { code: "ne", label: "NE", native: "नेपाली" },
  { code: "sa", label: "SA", native: "संस्कृत" },
  { code: "bn", label: "BN", native: "বাংলা" },
  { code: "as", label: "AS", native: "অসমীয়া" },
  { code: "gu", label: "GU", native: "ગુજરાતી" },
  { code: "pa", label: "PA", native: "ਪੰਜਾਬੀ" },
  { code: "or", label: "OR", native: "ଓଡ଼ିଆ" },
  { code: "te", label: "TE", native: "తెలుగు" },
  { code: "kn", label: "KN", native: "ಕನ್ನಡ" },
  { code: "ml", label: "ML", native: "മലയാളം" },
  { code: "ta", label: "TA", native: "தமிழ்" },
  { code: "ur", label: "UR", native: "اردو" },
  { code: "sd", label: "SD", native: "سنڌي" },
  { code: "ks", label: "KS", native: "कॉशुर" },
  { code: "kok", label: "KOK", native: "कोंकणी" },
  { code: "mai", label: "MAI", native: "मैथिली" },
  { code: "doi", label: "DOI", native: "डोगरी" },
  { code: "brx", label: "BRX", native: "बर'थ" },
  { code: "mni", label: "MNI", native: "মণিপুরি" },
  { code: "sat", label: "SAT", native: "ᱥᱟᱱᱛᱟᱲᱤ" },
  { code: "es", label: "ES", native: "Español" },
];

const urduWords = ["کیا", "ہے", "اور", "سے", "میں", "کا", "کی", "کے", "نہیں", "ہوں", "آپ", "تم", "یہ", "وہ", "گے", "تھا", "تھی", "تھے"];
const sindhiWords = ["ڪيئن", "آهين", "هو", "آهي", "تون", "مون", "سان", "لاء", "ڪري", "ڏي"];
const kashmiriWords = ["کیا", "چھ", "چھُ", "چھِ", "گا", "گے", "گِی", "آس", "اوس", "اوسُ"];

const devanagari = /[\u0900-\u097F]/;
const bengali = /[\u0980-\u09FF]/;
const gurmukhi = /[\u0A00-\u0A7F]/;
const gujarati = /[\u0A80-\u0AFF]/;
const odia = /[\u0B00-\u0B7F]/;
const tamil = /[\u0B80-\u0BFF]/;
const telugu = /[\u0C00-\u0C7F]/;
const kannada = /[\u0C80-\u0CFF]/;
const malayalam = /[\u0D00-\u0D7F]/;
const arabicScript = /[\u0600-\u06FF\u0750-\u077F]/;
const olChiki = /[\u1C50-\u1C7F]/;
const meitei = /[\uABE0-\uABFF]/;

export function detectLanguage(text: string): Language {
  const words = text.split(/\s+/).filter(Boolean);

  if (olChiki.test(text)) return "sat";
  if (meitei.test(text)) return "mni";
  if (bengali.test(text)) return "bn";
  if (gurmukhi.test(text)) return "pa";
  if (gujarati.test(text)) return "gu";
  if (odia.test(text)) return "or";
  if (tamil.test(text)) return "ta";
  if (telugu.test(text)) return "te";
  if (kannada.test(text)) return "kn";
  if (malayalam.test(text)) return "ml";

  if (devanagari.test(text)) {
    if (words.some(w => w.endsWith("े") || w.endsWith("ो"))) return "ne";
    if (words.some(w => w.endsWith("ः") || w.endsWith("्"))) return "sa";
    if (words.some(w => w.includes("ा") && w.endsWith("ं"))) return "mr";
    if (words.some(w => w.endsWith("ै"))) return "mai";
    return "hi";
  }

  if (arabicScript.test(text)) {
    if (words.some(w => sindhiWords.includes(w))) return "sd";
    if (words.some(w => kashmiriWords.includes(w))) return "ks";
    if (words.some(w => urduWords.includes(w))) return "ur";
    return "ur";
  }

  return "en";
}

export function getLangName(code: Language): string {
  const lang = languages.find(l => l.code === code);
  return lang ? lang.native : "English";
}
