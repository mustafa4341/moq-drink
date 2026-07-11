/* ═══════════════════════════════════════════════════════════════
   MOQ DRINKS — Centralized Drink Data
   
   8 drinks with multiple personality variations,
   energy profiles, jokes, and visual identity.
   
   To add product images:
   1. Place image in public/images/ (e.g. merida.png)
   2. Update the `image` field below with the path
   ═══════════════════════════════════════════════════════════════ */

export interface ResultTheme {
  tagline: string;
  worldSubtext: string;
  ingredientsSubtext: string;
  jokeNormal: string;
  jokeBold: string;
  jokeEmoji: string;
  bgGrad: string;
  accentGlow: string;
  coreSymbol: string;
  particleType: "snow" | "embers" | "petals" | "leaves" | "pollen" | "bubbles" | "sparkles" | "citrus";
  particleColor: string;
  bgDecorativeClasses?: string;
}

export interface MoqDrink {
  id: string;
  name: string;
  emoji: string;
  color: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
  gradient: string;
  image: string;
  personalities: string[];
  joke: string;
  traits: {
    cesaret: number;    // 0-100
    dinginlik: number;  // 0-100
    nese: number;       // 0-100
    ferahlık: number;   // 0-100
  };
  ingredients: string[];
  worldName: string;
  resultTheme: ResultTheme;
}

export const MOQ_DRINKS: MoqDrink[] = [
  {
    id: "merida",
    name: "MERIDA",
    emoji: "🍊",
    color: "#E58A2B",
    bgColor: "bg-[#fff2df]",
    textColor: "text-[#e58a2b]",
    glowColor: "rgba(229, 138, 43, 0.3)",
    gradient: "linear-gradient(135deg, #FFF2DF 0%, #FFD9A0 50%, #E58A2B 100%)",
    image: "/images/merida.png",
    personalities: [
      `Hayatı "bir gün yaparım" diyerek yaşamıyorsun.\nBir fikrin varsa deniyorsun.\nYeni yerler görmek, yeni insanlar tanımak ve yeni tatlar keşfetmek seni heyecanlandırıyor.\nBazen plansız olmak en güzel planın oluyor.\nBugün enerjin tam bir Merida.\nPortakalın canlılığı, mangonun sıcaklığı ve limonun ferahlığı tam sana göre.\nBugün yeni bir şey dene. Belki de ilk adım sadece bir yudumdur.`,
      `Haritaları değil, merakını takip ediyorsun.\nRutin seni biraz sıkıyor.\nHayatın en güzel anları çoğu zaman spontane verdiğin kararlardan çıkıyor.\nMOQ seni bugün Merida ile eşleştirdi.\nÇünkü bazen en güzel macera sadece bir bardakta başlar.`,
    ],
    joke: "Google Maps seni değil, sen Google Maps'i şaşırtıyorsun.",
    traits: {
      cesaret: 78,
      dinginlik: 35,
      nese: 72,
      ferahlık: 65,
    },
    ingredients: ["Portakal", "Mango", "Limon"],
    worldName: "Kaşif",
    resultTheme: {
      tagline: "Maceraya atıl, sınırları keşfet.",
      worldSubtext: "Bilinmeyenin heyecanı her zaman seninle.",
      ingredientsSubtext: "Egzotik, tatlı ve canlandırıcı meyve karması.",
      jokeNormal: "Google Maps seni değil, ",
      jokeBold: "sen Google Maps'i şaşırtıyorsun.",
      jokeEmoji: "🧭",
      bgGrad: "from-[#FFFDF9] via-[#FFF2DF]/30 to-[#FFE3BA]/40",
      accentGlow: "rgba(229, 138, 43, 0.35)",
      coreSymbol: "🧭",
      particleType: "petals",
      particleColor: "rgba(229, 138, 43, 0.3)",
    }
  },
  {
    id: "cool-lime",
    name: "COOL LIME",
    emoji: "🌿",
    color: "#73b83e",
    bgColor: "bg-[#e5f5e4]",
    textColor: "text-[#73b83e]",
    glowColor: "rgba(115, 184, 62, 0.3)",
    gradient: "linear-gradient(135deg, #E5F5E4 0%, #B8E6A0 50%, #73b83e 100%)",
    image: "/images/cool_lime.png",
    personalities: [
      `Herkes paniklerken sen\n"Bir sakin olun."\ndiyen kişisin.\nİnsanlar yanında kendilerini rahat hissediyor.\nFerahlığın bulaşıcı.\nBugün MOQ sana\nCool Lime\ndiyor.`,
      `Bazen en güçlü insanlar\nen sessiz olanlardır.\nGereksiz drama yerine\niyi sohbeti seçiyorsun.\nNane kadar serin,\nlime kadar canlı.`,
    ],
    joke: "Telefonunun şarjı %3 olsa bile panik yapmıyorsun.",
    traits: {
      cesaret: 30,
      dinginlik: 88,
      nese: 55,
      ferahlık: 85,
    },
    ingredients: ["Lime", "Nane", "Soda"],
    worldName: "Sakin",
    resultTheme: {
      tagline: "Zihnini dinlendir, derin bir nefes al.",
      worldSubtext: "Yeşil vadilerin ferah esintisi.",
      ingredientsSubtext: "Ferahlatıcı, naneli ve serinletici nane-lime.",
      jokeNormal: "Telefonunun şarjı %3 olsa bile ",
      jokeBold: "hiç panik yapmıyorsun.",
      jokeEmoji: "🧘",
      bgGrad: "from-[#F7FDF6] via-[#E5F5E4]/20 to-[#CBEFC4]/30",
      accentGlow: "rgba(115, 184, 62, 0.35)",
      coreSymbol: "🍃",
      particleType: "leaves",
      particleColor: "rgba(115, 184, 62, 0.3)",
    }
  },
  {
    id: "redline",
    name: "REDLINE",
    emoji: "❤️",
    color: "#e04f75",
    bgColor: "bg-[#fce6ec]",
    textColor: "text-[#e04f75]",
    glowColor: "rgba(224, 79, 117, 0.3)",
    gradient: "linear-gradient(135deg, #FCE6EC 0%, #F0A0B8 50%, #e04f75 100%)",
    image: "/images/redline.png",
    personalities: [
      `Beklemeyi pek seven biri değilsin.\nFırsat gördüğünde ilk adımı atan sensin.\nBazen fazla cesur oluyorsun ama zaten güzel hikâyeler biraz cesaret ister.\nBugün enerjin Redline.\nHibiscus kadar güçlü,\nçilek kadar dikkat çekici,\ntam senlik.`,
      `Bulunduğun ortam biraz sessizse,\nçok büyük ihtimalle sen daha yeni gelmişsindir.\nEnerjin yükseltmeyi seviyorsun.\nMOQ bugün seni Redline olarak görüyor.`,
    ],
    joke: "Kahve seni uyandırmıyor. Sen kahveyi uyandırıyorsun.",
    traits: {
      cesaret: 92,
      dinginlik: 20,
      nese: 70,
      ferahlık: 40,
    },
    ingredients: ["Hibiscus", "Çilek", "Sweet & Sour", "Limon"],
    worldName: "Lider",
    resultTheme: {
      tagline: "Tutkunu seç, sınırları zorla.",
      worldSubtext: "İçindeki kıvılcım ateşe dönüşüyor.",
      ingredientsSubtext: "Güçlü, meyveli ve kırmızı tonlu orman lezzeti.",
      jokeNormal: "Kahve seni uyandırmıyor. ",
      jokeBold: "Sen kahveyi uyandırıyorsun.",
      jokeEmoji: "⚡",
      bgGrad: "from-[#FFF7F9] via-[#FCE6EC]/25 to-[#F9CDD9]/35",
      accentGlow: "rgba(224, 79, 117, 0.35)",
      coreSymbol: "🔥",
      particleType: "embers",
      particleColor: "rgba(224, 79, 117, 0.3)",
    }
  },
  {
    id: "sundrop",
    name: "SUNDROP",
    emoji: "☀️",
    color: "#f0a030",
    bgColor: "bg-[#fff5e0]",
    textColor: "text-[#f0a030]",
    glowColor: "rgba(240, 160, 48, 0.3)",
    gradient: "linear-gradient(135deg, #FFF5E0 0%, #FFE0A0 50%, #f0a030 100%)",
    image: "/images/sundrop.png",
    personalities: [
      `İnsanların yüzünü güldürmek\nsana iyi geliyor.\nKüçük mutlulukları büyütebiliyorsun.\nBugün güneş biraz daha parlaksa\nbelki de sebebi sensindir.`,
      `Sen acele etmiyorsun.\nDoğru zamanı bekliyorsun.\nVe çoğu zaman haklı çıkıyorsun.\nBugündeki MOQ'un\nSundrop.`,
    ],
    joke: "Hava durumunu açmana gerek yok. Sen zaten güneş getiriyorsun.",
    traits: {
      cesaret: 45,
      dinginlik: 72,
      nese: 90,
      ferahlık: 60,
    },
    ingredients: ["Mango", "Portakal", "Bal", "Gün Işığı"],
    worldName: "Sıcakkanlı",
    resultTheme: {
      tagline: "Senin ışığın, senin anın.",
      worldSubtext: "Güneşin sıcaklığı seninle.",
      ingredientsSubtext: "Mango • Portakal • Bal • Gün Işığı",
      jokeNormal: "Hava durumunu açmana gerek yok. ",
      jokeBold: "Sen zaten güneş getiriyorsun.",
      jokeEmoji: "😎",
      bgGrad: "from-[#FFFDF7] via-[#FFF5E0]/30 to-[#FFE9BC]/40",
      accentGlow: "rgba(240, 160, 48, 0.35)",
      coreSymbol: "☀️",
      particleType: "pollen",
      particleColor: "rgba(240, 160, 48, 0.3)",
    }
  },
  {
    id: "sunset",
    name: "SUNSET",
    emoji: "🌅",
    color: "#d4622b",
    bgColor: "bg-[#ffe8d6]",
    textColor: "text-[#d4622b]",
    glowColor: "rgba(212, 98, 43, 0.3)",
    gradient: "linear-gradient(135deg, #FFE8D6 0%, #F5B88A 50%, #d4622b 100%)",
    image: "/images/sunset.png",
    personalities: [
      `Herkes koşarken\nsen bazen durup manzarayı izliyorsun.\nHayatın güzel taraflarını fark etmek\nsenin süper gücün.\nBugün sana en çok yakışan\nSunset.`,
      `Senin enerjin\nyüksek sesli değil.\nAma uzun süre akılda kalıyor.\nMOQ bugün seni\nSunset\nolarak görüyor.`,
    ],
    joke: "Fotoğraf çekerken gün batımını bekleyen ekipten misin? Biz de öyle düşünmüştük.",
    traits: {
      cesaret: 38,
      dinginlik: 85,
      nese: 65,
      ferahlık: 50,
    },
    ingredients: ["Greyfurt", "Portakal", "Rom", "Şeker"],
    worldName: "Hayalperest",
    resultTheme: {
      tagline: "Günü bitirirken hayallere dal.",
      worldSubtext: "Gün batımının eşsiz büyülü renkleri.",
      ingredientsSubtext: "Egzotik greyfurt aromalı gün batımı tatları.",
      jokeNormal: "Fotoğraf çekerken gün batımını bekleyen ",
      jokeBold: "o romantik ekiptensin.",
      jokeEmoji: "🌇",
      bgGrad: "from-[#FFFBF9] via-[#FFE8D6]/35 to-[#FFCFB2]/40",
      accentGlow: "rgba(212, 98, 43, 0.35)",
      coreSymbol: "🌅",
      particleType: "sparkles",
      particleColor: "rgba(212, 98, 43, 0.3)",
    }
  },
  {
    id: "limonata",
    name: "LİMONATA",
    emoji: "🍋",
    color: "#c9a800",
    bgColor: "bg-[#fefce8]",
    textColor: "text-[#c9a800]",
    glowColor: "rgba(201, 168, 0, 0.3)",
    gradient: "linear-gradient(135deg, #FEFCE8 0%, #FFF3A0 50%, #c9a800 100%)",
    image: "/images/limonata.png",
    personalities: [
      `Gösterişten çok\nsamimiyeti seviyorsun.\nSadelik senin tarzın.\nVe dürüst olmak gerekirse\nbazen en iyi seçim\nen klasik olanıdır.`,
      `Bazı şeylerin modası geçmez.\nTıpkı senin enerjin gibi.\nBugün eşleşmen\nLimonata.`,
    ],
    joke: "Hayat sana limon verirse... Sen zaten limonata içiyorsun.",
    traits: {
      cesaret: 40,
      dinginlik: 75,
      nese: 68,
      ferahlık: 70,
    },
    ingredients: ["Limon", "Şeker", "Nane", "Su"],
    worldName: "Doğal",
    resultTheme: {
      tagline: "Klasik bir esinti, samimi bir tat.",
      worldSubtext: "Geleneksel limon bahçelerinin tazeliği.",
      ingredientsSubtext: "Doğal limon özleri ve nane tazeliği.",
      jokeNormal: "Hayat sana ekşi limonlar verse de ",
      jokeBold: "sen onlardan tatlı limonata yapıyorsun.",
      jokeEmoji: "🍋",
      bgGrad: "from-[#FFFFFA] via-[#FEFCE8]/20 to-[#FFF7BA]/30",
      accentGlow: "rgba(201, 168, 0, 0.35)",
      coreSymbol: "🍋",
      particleType: "citrus",
      particleColor: "rgba(201, 168, 0, 0.25)",
    }
  },
  {
    id: "churchill",
    name: "CHURCHILL",
    emoji: "🧂",
    color: "#5e6f88",
    bgColor: "bg-[#eef1f5]",
    textColor: "text-[#5e6f88]",
    glowColor: "rgba(94, 111, 136, 0.3)",
    gradient: "linear-gradient(135deg, #EEF1F5 0%, #C8D0DC 50%, #5e6f88 100%)",
    image: "/images/churchill.png",
    personalities: [
      `Kolay tahmin edilen biri değilsin.\nİnsanlar seni ilk bakışta çözemez.\nBelki de en güzel tarafın bu.\nMOQ bugün sana\nChurchill\nverdi.\nNadir çıkanlardan.`,
    ],
    joke: "Normal olmak fazla normal geldi.",
    traits: {
      cesaret: 60,
      dinginlik: 80,
      nese: 42,
      ferahlık: 35,
    },
    ingredients: ["Gin", "Bitter", "Limon", "Soğuk"],
    worldName: "Nadir",
    resultTheme: {
      tagline: "Sıradışı bir duruş, kendine has bir tat.",
      worldSubtext: "Vintage ve klasik çizgilerin eşsiz sadeliği.",
      ingredientsSubtext: "Tuz, limon ve sodanın çarpıcı dengesi.",
      jokeNormal: "Normal ve sıradan olmak ",
      jokeBold: "sana her zaman fazla sıkıcı geldi.",
      jokeEmoji: "🎩",
      bgGrad: "from-[#FDFDFE] via-[#EEF1F5]/30 to-[#D5DEEB]/40",
      accentGlow: "rgba(94, 111, 136, 0.35)",
      coreSymbol: "🧂",
      particleType: "bubbles",
      particleColor: "rgba(94, 111, 136, 0.25)",
    }
  },
  {
    id: "portakal-suyu",
    name: "PORTAKAL SUYU",
    emoji: "🍊",
    color: "#f59e0b",
    bgColor: "bg-[#fff7ed]",
    textColor: "text-[#f59e0b]",
    glowColor: "rgba(245, 158, 11, 0.3)",
    gradient: "linear-gradient(135deg, #FFF7ED 0%, #FDE68A 50%, #f59e0b 100%)",
    image: "/images/portakal_suyu.png",
    personalities: [
      `Enerjin doğal.\nRol yapmıyorsun.\nOlduğun gibisin.\nVe bu fazlasıyla yeterli.\nBugün MOQ seni\nPortakal Suyu\nile eşleştirdi.`,
    ],
    joke: "Vitamin C seviyen bizden yüksek olabilir.",
    traits: {
      cesaret: 50,
      dinginlik: 78,
      nese: 82,
      ferahlık: 68,
    },
    ingredients: ["Portakal", "Vitamin C", "Güneş", "Tazelik"],
    worldName: "Saf",
    resultTheme: {
      tagline: "Güne enerjik başla, doğal kal.",
      worldSubtext: "Geniş portakal bahçelerinin sabah güneşi.",
      ingredientsSubtext: "Sıkma taze portakallardan gelen saf C vitamini.",
      jokeNormal: "Güneş enerjini ölçemiyoruz ama ",
      jokeBold: "Vitamin C seviyen bizden yüksek olabilir.",
      jokeEmoji: "🍹",
      bgGrad: "from-[#FFFDF9] via-[#FFF7ED]/30 to-[#FCE0AC]/45",
      accentGlow: "rgba(245, 158, 11, 0.35)",
      coreSymbol: "🍊",
      particleType: "pollen",
      particleColor: "rgba(245, 158, 11, 0.3)",
    }
  },
];

/* ═══════════════════════════════════════════════════════════════
   RARE MESSAGES — Shown with 5% probability below result
   ═══════════════════════════════════════════════════════════════ */
export const RARE_MESSAGES: string[] = [
  "Bugün evren değil, MOQ sana göz kırptı.",
  "Bardaktaki ilk yudum bazen bütün günü değiştirebilir.",
  "Küçük bir tavsiye: Bugün kendine güzel davran.",
  "Senin enerjin bugün tam MOQ'luk.",
  "Bu sonuç sadece bugün için geçerli olabilir.\nYarın tekrar denemeye ne dersin?",
  "Arkadaşının MOQ'unu da merak etmiyor musun?",
  "QR'ı ona uzat. 😄",
];

/* ═══════════════════════════════════════════════════════════════
   MINI JOKE POOL — Random joke below result
   ═══════════════════════════════════════════════════════════════ */
export const MINI_JOKES: string[] = [
  "Bunu ekran görüntüsü alıp 'beni çözmüşler' diye paylaşabilirsin.",
  "Bu sonuç tamamen eğlence amaçlıdır... ama biraz fazla isabetli olabilir.",
  "Arkadaşını da denet. Belki aynı içecek çıkmaz.",
  "İkinci kez denersen belki MOQ seni yine şaşırtır.",
  "Bugünkü modun belli oldu. Şimdi sıra ilk yudumda.",
  "Bu sonuç için kahve falına bakılmadı, sadece MOQ usulü yorumlandı.",
  "Bazen bir içecek sadece içecek değildir.",
];
