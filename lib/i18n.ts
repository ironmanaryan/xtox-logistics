export type Locale = "en" | "hi" | "kn";

export const LOCALES: { code: Locale; label: string; short: string }[] = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "HI" },
  { code: "kn", label: "ಕನ್ನಡ", short: "KN" },
];

export const DEFAULT_LOCALE: Locale = "en";

const en = {
  "nav.services": "Services",
  "nav.resources": "Resources",
  "nav.company": "Company",
  "nav.industries": "Industries",
  "nav.support": "Support",
  "nav.quote": "Get a Quote",
  "nav.login": "Login",

  "hero.badge": "Road · Air · Sea · Rail",
  "hero.titleLine1": "Move anything.",
  "hero.titleLine2": "X to X.",
  "hero.subtitle":
    "Packers & Movers, EXIM, SME trucks and agri-export — one partner, door to door.",
  "hero.cta": "Get a quote",
  "hero.how": "How it works",
  "hero.tab.price": "Get price",
  "hero.tab.track": "Track",
  "hero.pickup": "Pickup city",
  "hero.drop": "Drop city",
  "hero.service": "Service / vehicle",
  "hero.submit": "Get my price",
  "hero.footnote": "Free quote · callback in 2 business hours",
  "hero.trackLabel": "LR / shipment number",
  "hero.trackCta": "Track shipment",

  "quote.title": "Tell us what moves",
  "quote.step1": "Step 1 of 2 · Your requirement",
  "quote.step2": "Step 2 of 2 · Optional details",
  "quote.name": "Full name",
  "quote.phone": "Phone",
  "quote.service": "Service needed",
  "quote.from": "From",
  "quote.to": "To",
  "quote.company": "Company",
  "quote.cargo": "Cargo details",
  "quote.details": "Anything else we should know?",
  "quote.next": "Continue",
  "quote.back": "Back",
  "quote.submit": "Get my free quote",
  "quote.successTitle": "Request received",
  "quote.successBody": "Our logistics manager will call you within",
  "quote.successHint":
    "Keep your phone handy. Meanwhile you can send us photos of the goods on WhatsApp.",
  "quote.whatsapp": "Continue on WhatsApp",
  "quote.another": "Send another request",

  "common.call": "Call",
  "common.whatsapp": "WhatsApp",
  "common.quote": "Get quote",
} as const;

export type TKey = keyof typeof en;

const hi: Record<TKey, string> = {
  "nav.services": "सेवाएं",
  "nav.resources": "संसाधन",
  "nav.company": "कंपनी",
  "nav.industries": "उद्योग",
  "nav.support": "सहायता",
  "nav.quote": "कोटेशन लें",
  "nav.login": "लॉगिन",

  "hero.badge": "सड़क · हवाई · समुद्री · रेल",
  "hero.titleLine1": "कुछ भी भेजें।",
  "hero.titleLine2": "X से X तक।",
  "hero.subtitle":
    "पैकर्स एंड मूवर्स, EXIM, SME ट्रक और एग्री-एक्सपोर्ट — एक पार्टनर, डोर-टू-डोर।",
  "hero.cta": "कोटेशन पाएं",
  "hero.how": "यह कैसे काम करता है",
  "hero.tab.price": "कीमत पाएं",
  "hero.tab.track": "ट्रैक करें",
  "hero.pickup": "पिकअप शहर",
  "hero.drop": "ड्रॉप शहर",
  "hero.service": "सेवा / वाहन",
  "hero.submit": "कीमत पाएं",
  "hero.footnote": "मुफ़्त कोटेशन · 2 कार्य घंटों में कॉल",
  "hero.trackLabel": "LR / शिपमेंट नंबर",
  "hero.trackCta": "शिपमेंट ट्रैक करें",

  "quote.title": "बताइए क्या भेजना है",
  "quote.step1": "चरण 1 / 2 · आपकी आवश्यकता",
  "quote.step2": "चरण 2 / 2 · अतिरिक्त जानकारी",
  "quote.name": "पूरा नाम",
  "quote.phone": "फ़ोन",
  "quote.service": "आवश्यक सेवा",
  "quote.from": "कहां से",
  "quote.to": "कहां तक",
  "quote.company": "कंपनी",
  "quote.cargo": "कार्गो विवरण",
  "quote.details": "और कुछ जो हमें पता होना चाहिए?",
  "quote.next": "आगे बढ़ें",
  "quote.back": "वापस",
  "quote.submit": "मुफ़्त कोटेशन पाएं",
  "quote.successTitle": "अनुरोध मिल गया",
  "quote.successBody": "हमारा लॉजिस्टिक्स मैनेजर आपको इस समय के भीतर कॉल करेगा:",
  "quote.successHint":
    "फ़ोन पास रखें। इस बीच आप व्हाट्सएप पर सामान की फ़ोटो भेज सकते हैं।",
  "quote.whatsapp": "व्हाट्सएप पर बात करें",
  "quote.another": "एक और अनुरोध भेजें",

  "common.call": "कॉल",
  "common.whatsapp": "व्हाट्सएप",
  "common.quote": "कोटेशन",
};

const kn: Record<TKey, string> = {
  "nav.services": "ಸೇವೆಗಳು",
  "nav.resources": "ಸಂಪನ್ಮೂಲಗಳು",
  "nav.company": "ಕಂಪನಿ",
  "nav.industries": "ಉದ್ಯಮಗಳು",
  "nav.support": "ಬೆಂಬಲ",
  "nav.quote": "ಕೋಟ್ ಪಡೆಯಿರಿ",
  "nav.login": "ಲಾಗಿನ್",

  "hero.badge": "ರಸ್ತೆ · ವಾಯು · ಸಮುದ್ರ · ರೈಲು",
  "hero.titleLine1": "ಏನನ್ನಾದರೂ ಕಳುಹಿಸಿ.",
  "hero.titleLine2": "X ನಿಂದ X ವರೆಗೆ.",
  "hero.subtitle":
    "ಪ್ಯಾಕರ್ಸ್ ಆ್ಯಂಡ್ ಮೂವರ್ಸ್, EXIM, SME ಟ್ರಕ್ಗಳು ಮತ್ತು ಕೃಷಿ ರಫ್ತು — ಒಬ್ಬ ಪಾಲುದಾರ, ಬಾಗಿಲಿನಿಂದ ಬಾಗಿಲಿಗೆ.",
  "hero.cta": "ಕೋಟ್ ಪಡೆಯಿರಿ",
  "hero.how": "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
  "hero.tab.price": "ಬೆಲೆ ಪಡೆಯಿರಿ",
  "hero.tab.track": "ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",
  "hero.pickup": "ಪಿಕಪ್ ನಗರ",
  "hero.drop": "ಡ್ರಾಪ್ ನಗರ",
  "hero.service": "ಸೇವೆ / ವಾಹನ",
  "hero.submit": "ಬೆಲೆ ಪಡೆಯಿರಿ",
  "hero.footnote": "ಉಚಿತ ಕೋಟ್ · 2 ಕೆಲಸದ ಗಂಟೆಗಳಲ್ಲಿ ಕರೆ",
  "hero.trackLabel": "LR / ಶಿಪ್ಮೆಂಟ್ ಸಂಖ್ಯೆ",
  "hero.trackCta": "ಶಿಪ್ಮೆಂಟ್ ಟ್ರ್ಯಾಕ್ ಮಾಡಿ",

  "quote.title": "ಏನು ಸಾಗಿಸಬೇಕು ಎಂದು ತಿಳಿಸಿ",
  "quote.step1": "ಹಂತ 1 / 2 · ನಿಮ್ಮ ಅಗತ್ಯ",
  "quote.step2": "ಹಂತ 2 / 2 · ಹೆಚ್ಚುವರಿ ವಿವರಗಳು",
  "quote.name": "ಪೂರ್ಣ ಹೆಸರು",
  "quote.phone": "ಫೋನ್",
  "quote.service": "ಅಗತ್ಯವಿರುವ ಸೇವೆ",
  "quote.from": "ಎಲ್ಲಿಂದ",
  "quote.to": "ಎಲ್ಲಿಗೆ",
  "quote.company": "ಕಂಪನಿ",
  "quote.cargo": "ಸರಕು ವಿವರ",
  "quote.details": "ನಾವು ತಿಳಿಯಬೇಕಾದ ಇನ್ನೇನಾದರೂ ಇದೆಯೇ?",
  "quote.next": "ಮುಂದುವರಿಸಿ",
  "quote.back": "ಹಿಂದೆ",
  "quote.submit": "ಉಚಿತ ಕೋಟ್ ಪಡೆಯಿರಿ",
  "quote.successTitle": "ವಿನಂತಿ ಸ್ವೀಕರಿಸಲಾಗಿದೆ",
  "quote.successBody": "ನಮ್ಮ ಲಾಜಿಸ್ಟಿಕ್ಸ್ ಮ್ಯಾನೇಜರ್ ಈ ಸಮಯದೊಳಗೆ ಕರೆ ಮಾಡುತ್ತಾರೆ:",
  "quote.successHint":
    "ಫೋನ್ ಹತ್ತಿರ ಇಟ್ಟುಕೊಳ್ಳಿ. ಈ ನಡುವೆ ವಾಟ್ಸಾಪ್ನಲ್ಲಿ ಸರಕಿನ ಫೋಟೋ ಕಳುಹಿಸಬಹುದು.",
  "quote.whatsapp": "ವಾಟ್ಸಾಪ್ನಲ್ಲಿ ಮಾತನಾಡಿ",
  "quote.another": "ಇನ್ನೊಂದು ವಿನಂತಿ ಕಳುಹಿಸಿ",

  "common.call": "ಕರೆ",
  "common.whatsapp": "ವಾಟ್ಸಾಪ್",
  "common.quote": "ಕೋಟ್",
};

export const dict: Record<Locale, Record<TKey, string>> = { en, hi, kn };

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "en" || value === "hi" || value === "kn";
}
