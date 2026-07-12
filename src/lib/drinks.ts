/* ═══════════════════════════════════════════════════════════════
   MOQ DRINKS — Enriched Centralized Drink Data
   Single source of truth for Carousel, ProductWorlds,
   Mood Finder, and BottomSheet.
   ═══════════════════════════════════════════════════════════════ */

export interface DrinkColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  particle: string;
}

export interface DrinkTheme {
  emoji: string;
  icon: string;
  particle: "leaf" | "snow" | "spark" | "flower" | "bubble" | "citrus";
  animation: "float" | "snow" | "wave";
  bgEffects: string[];
}

export interface DrinkMobile {
  popupGradient: string;
  popupGlow: string;
  popupBackground: string;
}

export interface DrinkDesktop {
  worldGradient: string;
  parallaxIntensity: number;
}

export interface DrinkTraits {
  cesaret: number;
  dinginlik: number;
  nese: number;
  ferahlık: number;
}

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
}

export interface Drink {
  id: string;
  name: string;
  worldName: string;
  shortTitle: string;
  subtitle: string;
  story: string;
  moodMessage: string;
  ingredients: string[];
  moods: string[];
  flavorNotes: string[];
  colors: DrinkColors;
  theme: DrinkTheme;
  mobile: DrinkMobile;
  desktop: DrinkDesktop;
  
  // Compatibility fields for legacy components & Mood Finder
  emoji: string;
  color: string;
  bgColor: string;
  textColor: string;
  glowColor: string;
  gradient: string;
  image: string;
  personalities: string[];
  joke: string;
  traits: DrinkTraits;
  resultTheme: ResultTheme;
}

export type MoqDrink = Drink;


export const MOQ_DRINKS: Drink[] = [
  {
    id: "cool-lime",
    name: "COOL LIME",
    worldName: "Yeşil Vadi",
    shortTitle: "LIME FRESH",
    subtitle: "SADE VE DOĞAL",
    story: "Akdeniz'in serin sabahlarından ilham alan bu dünya, taze nane yaprakları ve lime'ın ferahlığını tek yudumda buluşturuyor. Gürültüyü susturup nefes almak istediğinde seni bekliyor.",
    moodMessage: "Bugün acele etmene gerek yok. Ferahlık zaten seni bulacak.",
    ingredients: ["Lime Suyu", "Fresh Mint", "Soda"],
    moods: ["Doğal", "Sakin", "Ferah"],
    flavorNotes: ["Lime", "Fresh Mint", "Soda"],
    colors: {
      primary: "#7CCB45",
      secondary: "#B8E6A0",
      accent: "#7CCB45",
      background: "#E5F5E4",
      particle: "#7CCB45"
    },
    theme: {
      emoji: "🌿",
      icon: "leaf",
      particle: "leaf",
      animation: "float",
      bgEffects: ["green-mist", "lime-slices", "leaves", "glass-reflection"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(124, 203, 69, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(124, 203, 69, 0.25)",
      popupBackground: "#E5F5E4"
    },
    desktop: {
      worldGradient: "from-[#F7FDF6] via-[#E5F5E4]/30 to-[#CBEFC4]/40",
      parallaxIntensity: 1.2
    },
    emoji: "🌿",
    color: "#7CCB45",
    bgColor: "bg-[#e5f5e4]",
    textColor: "text-[#7CCB45]",
    glowColor: "rgba(124, 203, 69, 0.3)",
    gradient: "linear-gradient(135deg, #E5F5E4 0%, #B8E6A0 50%, #7CCB45 100%)",
    image: "/images/cool_lime.png",
    personalities: [
      `Herkes paniklerken sen\n"Bir sakin olun."\ndiyen kişisin.\nİnsanlar yanında kendilerini rahat hissediyor.\nFerahlığın bulaşıcı.\nBugün MOQ sana\nCool Lime\ndiyor.`,
      `Bazen en güçlü insanlar\nen sessiz olanlardır.\nGereksiz drama yerine\niyi sohbeti seçiyorsun.\nNane kadar serin,\nlime kadar canlı.`
    ],
    joke: "Telefonunun şarjı %3 olsa bile panik yapmıyorsun.",
    traits: {
      cesaret: 30,
      dinginlik: 88,
      nese: 55,
      ferahlık: 85
    },
    resultTheme: {
      tagline: "Zihnini dinlendir, derin bir nefes al.",
      worldSubtext: "Yeşil vadilerin ferah esintisi.",
      ingredientsSubtext: "Ferahlatıcı, naneli ve serinletici nane-lime.",
      jokeNormal: "Telefonunun şarjı %3 olsa bile ",
      jokeBold: "hiç panik yapmıyorsun.",
      jokeEmoji: "🧘",
      bgGrad: "from-[#F7FDF6] via-[#E5F5E4]/20 to-[#CBEFC4]/30",
      accentGlow: "rgba(124, 203, 69, 0.35)",
      coreSymbol: "🍃",
      particleType: "leaves",
      particleColor: "rgba(124, 203, 69, 0.3)"
    }
  },
  {
    id: "limonata",
    name: "LİMONATA",
    worldName: "Limon Bahçesi",
    shortTitle: "SUNSHINE",
    subtitle: "Tatlı & Ekşi",
    story: "Çocukluğun yaz günlerini hatırlatan limon kokusu, pancar şekerinin doğal dengesiyle birleşiyor. Tanıdık ama her zaman yeniden keşfedilesi.",
    moodMessage: "Bazen en güzel tarif, en sade olandır.",
    ingredients: ["Limon Suyu", "Pancar Şekeri", "Tatlı-Ekşi"],
    moods: ["Mutlu", "Sıcakkanlı", "Nostaljik"],
    flavorNotes: ["Limon", "Pancar Şekeri", "Tatlı-Ekşi"],
    colors: {
      primary: "#FFD84A",
      secondary: "#FFF3A0",
      accent: "#FFD84A",
      background: "#FEFCE8",
      particle: "#FFD84A"
    },
    theme: {
      emoji: "🍋",
      icon: "citrus",
      particle: "spark",
      animation: "snow",
      bgEffects: ["sunshine-rays", "limon-trees", "yellow-pollen"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(255, 216, 74, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(255, 216, 74, 0.25)",
      popupBackground: "#FEFCE8"
    },
    desktop: {
      worldGradient: "from-[#FFFFFA] via-[#FEFCE8]/30 to-[#FFF7BA]/40",
      parallaxIntensity: 1.0
    },
    emoji: "🍋",
    color: "#FFD84A",
    bgColor: "bg-[#fefce8]",
    textColor: "text-[#FFD84A]",
    glowColor: "rgba(255, 216, 74, 0.3)",
    gradient: "linear-gradient(135deg, #FEFCE8 0%, #FFF3A0 50%, #FFD84A 100%)",
    image: "/images/limonata.png",
    personalities: [
      `Gösterişten çok\nsamimiyeti seviyorsun.\nSadelik senin tarzın.\nVe dürüst olmak gerekirse\nbazen en iyi seçim\nen klasik olanıdır.`,
      `Bazı şeylerin modası geçmez.\nTıpkı senin enerjin gibi.\nBugün eşleşmen\nLimonata.`
    ],
    joke: "Hayat sana limon verirse... Sen zaten limonata içiyorsun.",
    traits: {
      cesaret: 40,
      dinginlik: 75,
      nese: 68,
      ferahlık: 70
    },
    resultTheme: {
      tagline: "Klasik bir esinti, samimi bir tat.",
      worldSubtext: "Geleneksel limon bahçelerinin tazeliği.",
      ingredientsSubtext: "Doğal limon özleri ve nane tazeliği.",
      jokeNormal: "Hayat sana ekşi limonlar verse de ",
      jokeBold: "sen onlardan tatlı limonata yapıyorsun.",
      jokeEmoji: "🍋",
      bgGrad: "from-[#FFFFFA] via-[#FEFCE8]/20 to-[#FFF7BA]/30",
      accentGlow: "rgba(255, 216, 74, 0.35)",
      coreSymbol: "🍋",
      particleType: "citrus",
      particleColor: "rgba(255, 216, 74, 0.25)"
    }
  },
  {
    id: "merida",
    name: "MERIDA",
    worldName: "Altın Tropikler",
    shortTitle: "MERIDA",
    subtitle: "Enerji Dolu",
    story: "Portakalın canlılığı, mangonun tropik dokunuşu ve limonun dengesiyle hazırlanmış bu dünya seni yerinde durmamaya davet ediyor.",
    moodMessage: "Plan yapmayı bırak. Bugün biraz spontane ol.",
    ingredients: ["Portakal Suyu", "Mango Püresi", "Limon", "Soda"],
    moods: ["Enerjik", "Pozitif", "Cesur"],
    flavorNotes: ["Portakal", "Mango", "Limon", "Soda"],
    colors: {
      primary: "#FF9F1A",
      secondary: "#FFE3BA",
      accent: "#FF9F1A",
      background: "#FFF2DF",
      particle: "#FF9F1A"
    },
    theme: {
      emoji: "🍊",
      icon: "fruit",
      particle: "flower",
      animation: "wave",
      bgEffects: ["orange-gradient", "sun-rays", "mango-leaves", "heatwave"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(255, 159, 26, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(255, 159, 26, 0.25)",
      popupBackground: "#FFF2DF"
    },
    desktop: {
      worldGradient: "from-[#FFFDF9] via-[#FFF2DF]/40 to-[#FFE3BA]/50",
      parallaxIntensity: 1.4
    },
    emoji: "🍊",
    color: "#FF9F1A",
    bgColor: "bg-[#fff2df]",
    textColor: "text-[#FF9F1A]",
    glowColor: "rgba(255, 159, 26, 0.3)",
    gradient: "linear-gradient(135deg, #FFF2DF 0%, #FFD9A0 50%, #FF9F1A 100%)",
    image: "/images/merida.png",
    personalities: [
      `Hayatı "bir gün yaparım" diyerek yaşamıyorsun.\nBir fikrin varsa deniyorsun.\nYeni yerler görmek, yeni insanlar tanımak ve yeni tatlar keşfetmek seni heyecanlandırıyor.\nBazen plansız olmak en güzel planın oluyor.\nBugün enerjin tam bir Merida.\nPortakalın canlılığı, mangonun sıcaklığı ve limonun ferahlığı tam sana göre.\nBugün yeni bir şey dene. Belki de ilk adım sadece bir yudumdur.`,
      `Haritaları değil, merakını takip ediyorsun.\nRutin seni biraz sıkıyor.\nHayatın en güzel anları çoğu zaman spontane verdiğin kararlardan çıkıyor.\nMOQ seni bugün Merida ile eşleştirdi.\nÇünkü bazen en güzel macera sadece bir bardakta başlar.`
    ],
    joke: "Google Maps seni değil, sen Google Maps'i şaşırtıyorsun.",
    traits: {
      cesaret: 78,
      dinginlik: 35,
      nese: 72,
      ferahlık: 65
    },
    resultTheme: {
      tagline: "Maceraya atıl, sınırları keşfet.",
      worldSubtext: "Bilinmeyenin heyecanı her zaman seninle.",
      ingredientsSubtext: "Egzotik, tatlı ve canlandırıcı meyve karması.",
      jokeNormal: "Google Maps seni değil, ",
      jokeBold: "sen Google Maps'i şaşırtıyorsun.",
      jokeEmoji: "🧭",
      bgGrad: "from-[#FFFDF9] via-[#FFF2DF]/30 to-[#FFE3BA]/40",
      accentGlow: "rgba(255, 159, 26, 0.35)",
      coreSymbol: "🧭",
      particleType: "petals",
      particleColor: "rgba(255, 159, 26, 0.3)"
    }
  },
  {
    id: "redline",
    name: "REDLINE",
    worldName: "Kızıl Ufuk",
    shortTitle: "REDLINE",
    subtitle: "Cesur ve Tutkulu",
    story: "Hibiscus ve çileğin güçlü karakteri, tatlı-ekşi dengenin üzerine kurulmuş. Sıradan günler için değil, iz bırakmak isteyenler için.",
    moodMessage: "Bugün biraz dikkat çekmende sakınca yok.",
    ingredients: ["Hibiscus", "Çilek", "Limon", "Tatlı-Ekşi"],
    moods: ["Tutkulu", "Cesur", "Karizmatik"],
    flavorNotes: ["Hibiscus", "Çilek", "Limon", "Tatlı-Ekşi"],
    colors: {
      primary: "#E63946",
      secondary: "#F9CDD9",
      accent: "#E63946",
      background: "#FCE6EC",
      particle: "#E63946"
    },
    theme: {
      emoji: "❤️",
      icon: "heart",
      particle: "spark",
      animation: "float",
      bgEffects: ["red-glow", "hibiscus-leaves", "sparkles", "vignette"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(230, 57, 70, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(230, 57, 70, 0.25)",
      popupBackground: "#FCE6EC"
    },
    desktop: {
      worldGradient: "from-[#FFF7F9] via-[#FCE6EC]/30 to-[#F9CDD9]/40",
      parallaxIntensity: 1.3
    },
    emoji: "❤️",
    color: "#E63946",
    bgColor: "bg-[#fce6ec]",
    textColor: "text-[#E63946]",
    glowColor: "rgba(230, 57, 70, 0.3)",
    gradient: "linear-gradient(135deg, #FCE6EC 0%, #F0A0B8 50%, #E63946 100%)",
    image: "/images/redline.png",
    personalities: [
      `Beklemeyi pek seven biri değilsin.\nFırsat gördüğünde ilk adımı atan sensin.\nBazen fazla cesur oluyorsun ama zaten güzel hikâyeler biraz cesaret ister.\nBugün enerjin Redline.\nHibiscus kadar güçlü,\nçilek kadar dikkat çekici,\ntam senlik.`,
      `Bulunduğun ortam biraz sessizse,\nçok büyük ihtimalle sen daha yeni gelmişsindir.\nEnerjin yükseltmeyi seviyorsun.\nMOQ bugün seni Redline olarak görüyor.`
    ],
    joke: "Kahve seni uyandırmıyor. Sen kahveyi uyandırıyorsun.",
    traits: {
      cesaret: 92,
      dinginlik: 20,
      nese: 70,
      ferahlık: 40
    },
    resultTheme: {
      tagline: "Tutkunu seç, sınırları zorla.",
      worldSubtext: "İçindeki kıvılcım ateşe dönüşüyor.",
      ingredientsSubtext: "Güçlü, meyveli ve kırmızı tonlu orman lezzeti.",
      jokeNormal: "Kahve seni uyandırmıyor. ",
      jokeBold: "Sen kahveyi uyandırıyorsun.",
      jokeEmoji: "⚡",
      bgGrad: "from-[#FFF7F9] via-[#FCE6EC]/25 to-[#F9CDD9]/35",
      accentGlow: "rgba(230, 57, 70, 0.35)",
      coreSymbol: "🔥",
      particleType: "embers",
      particleColor: "rgba(230, 57, 70, 0.3)"
    }
  },
  {
    id: "sundrop",
    name: "SUNDROP",
    worldName: "Altın Bahçe",
    shortTitle: "SUNDROP",
    subtitle: "Sıcak ve Dingin",
    story: "Ihlamurun huzuru ile şeftalinin yumuşak dokusu bir araya geliyor. Günün temposunu biraz yavaşlatmak isteyenlerin durağı.",
    moodMessage: "Bazı günler kazanmak değil, keyif almak yeterlidir.",
    ingredients: ["Ihlamur", "Şeftali", "Lime", "Tatlı-Ekşi"],
    moods: ["Dingin", "Sıcakkanlı", "Samimi"],
    flavorNotes: ["Ihlamur", "Şeftali", "Lime", "Tatlı-Ekşi"],
    colors: {
      primary: "#F4B400",
      secondary: "#FFE9BC",
      accent: "#F4B400",
      background: "#FFF5E0",
      particle: "#F4B400"
    },
    theme: {
      emoji: "☀️",
      icon: "sun",
      particle: "flower",
      animation: "snow",
      bgEffects: ["sunset-grad", "linden-leaves", "gold-glow"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(244, 180, 0, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(244, 180, 0, 0.25)",
      popupBackground: "#FFF5E0"
    },
    desktop: {
      worldGradient: "from-[#FFFDF7] via-[#FFF5E0]/40 to-[#FFE9BC]/50",
      parallaxIntensity: 1.1
    },
    emoji: "☀️",
    color: "#F4B400",
    bgColor: "bg-[#fff5e0]",
    textColor: "text-[#F4B400]",
    glowColor: "rgba(244, 180, 0, 0.3)",
    gradient: "linear-gradient(135deg, #FFF5E0 0%, #FFE0A0 50%, #F4B400 100%)",
    image: "/images/sundrop.png",
    personalities: [
      `İnsanların yüzünü güldürmek\nsana iyi geliyor.\nKüçük mutlulukları büyütebiliyorsun.\nBugün güneş biraz daha parlaksa\nbelki de sebebi sensindir.`,
      `Sen acele etmiyorsun.\nDoğru zamanı bekliyorsun.\nVe çoğu zaman haklı çıkıyorsun.\nBugündeki MOQ'un\nSundrop.`
    ],
    joke: "Hava durumunu açmana gerek yok. Sen zaten güneş getiriyorsun.",
    traits: {
      cesaret: 45,
      dinginlik: 72,
      nese: 90,
      ferahlık: 60
    },
    resultTheme: {
      tagline: "Senin ışığın, senin anın.",
      worldSubtext: "Güneşin sıcaklığı seninle.",
      ingredientsSubtext: "Mango • Portakal • Bal • Gün Işığı",
      jokeNormal: "Hava durumunu açmana gerek yok. ",
      jokeBold: "Sen zaten güneş getiriyorsun.",
      jokeEmoji: "😎",
      bgGrad: "from-[#FFFDF7] via-[#FFF5E0]/30 to-[#FFE9BC]/40",
      accentGlow: "rgba(244, 180, 0, 0.35)",
      coreSymbol: "☀️",
      particleType: "pollen",
      particleColor: "rgba(244, 180, 0, 0.3)"
    }
  },
  {
    id: "sunset",
    name: "SUNSET",
    worldName: "Gün Batımı Koyu",
    shortTitle: "SUNSET",
    subtitle: "Egzotik Yolculuk",
    story: "Ananas, nar ve hindistan cevizi tek bardakta buluşuyor. Gün bitiyor olabilir ama hikâyen daha yeni başlıyor.",
    moodMessage: "Gün batımı, yeni hikâyelerin başlangıcıdır.",
    ingredients: ["Ananas", "Nar", "Hindistan Cevizi", "Portakal"],
    moods: ["Maceracı", "Sıcakkanlı", "Özgür"],
    flavorNotes: ["Ananas", "Nar", "Hindistan Cevizi", "Portakal"],
    colors: {
      primary: "#FF6B35",
      secondary: "#FFCFB2",
      accent: "#FF6B35",
      background: "#FFE8D6",
      particle: "#FF6B35"
    },
    theme: {
      emoji: "🌅",
      icon: "sunset",
      particle: "spark",
      animation: "wave",
      bgEffects: ["sunset-cove", "palm-leaves", "pomegranate-particles"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(255, 107, 53, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(255, 107, 53, 0.25)",
      popupBackground: "#FFE8D6"
    },
    desktop: {
      worldGradient: "from-[#FFFBF9] via-[#FFE8D6]/40 to-[#FFCFB2]/50",
      parallaxIntensity: 1.2
    },
    emoji: "🌅",
    color: "#FF6B35",
    bgColor: "bg-[#ffe8d6]",
    textColor: "text-[#FF6B35]",
    glowColor: "rgba(255, 107, 53, 0.3)",
    gradient: "linear-gradient(135deg, #FFE8D6 0%, #F5B88A 50%, #FF6B35 100%)",
    image: "/images/sunset.png",
    personalities: [
      `Herkes koşarken\nsen bazen durup manzarayı izliyorsun.\nHayatın güzel taraflarını fark etmek\nsenin süper gücün.\nBugün sana en çok yakışan\nSunset.`,
      `Senin enerjin\nyüksek sesli değil.\nAma uzun süre akılda kalıyor.\nMOQ bugün seni\nSunset\nolarak görüyor.`
    ],
    joke: "Fotoğraf çekerken gün batımını bekleyen ekipten misin? Biz de öyle düşünmüştük.",
    traits: {
      cesaret: 38,
      dinginlik: 85,
      nese: 65,
      ferahlık: 50
    },
    resultTheme: {
      tagline: "Günü bitirirken hayallere dal.",
      worldSubtext: "Gün batımının eşsiz büyülü renkleri.",
      ingredientsSubtext: "Egzotik greyfurt aromalı gün batımı tatları.",
      jokeNormal: "Fotoğraf çekerken gün batımını bekleyen ",
      jokeBold: "o romantik ekiptensin.",
      jokeEmoji: "🌇",
      bgGrad: "from-[#FFFBF9] via-[#FFE8D6]/35 to-[#FFCFB2]/40",
      accentGlow: "rgba(255, 107, 53, 0.35)",
      coreSymbol: "🌅",
      particleType: "sparkles",
      particleColor: "rgba(255, 107, 53, 0.3)"
    }
  },
  {
    id: "churchill",
    name: "CHURCHILL",
    worldName: "Klasik Sokak",
    shortTitle: "CHURCHILL",
    subtitle: "Minimal ve Net",
    story: "Sadece limon, soda ve tuz. Gereksiz hiçbir şey yok. Bazen sadelik en güçlü karakterdir.",
    moodMessage: "Fazlasına ihtiyacın yok.",
    ingredients: ["Limon", "Soda", "Tuz"],
    moods: ["Minimal", "Net", "Kendinden Emin"],
    flavorNotes: ["Limon", "Soda", "Tuz"],
    colors: {
      primary: "#6D6D6D",
      secondary: "#D5DEEB",
      accent: "#6D6D6D",
      background: "#EEF1F5",
      particle: "#6D6D6D"
    },
    theme: {
      emoji: "🧂",
      icon: "spark",
      particle: "snow",
      animation: "float",
      bgEffects: ["fizzy-bubbles", "glass-lines", "minimal-white-grey"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(109, 109, 109, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(109, 109, 109, 0.25)",
      popupBackground: "#EEF1F5"
    },
    desktop: {
      worldGradient: "from-[#FDFDFE] via-[#EEF1F5]/40 to-[#D5DEEB]/50",
      parallaxIntensity: 0.9
    },
    emoji: "🧂",
    color: "#6D6D6D",
    bgColor: "bg-[#eef1f5]",
    textColor: "text-[#6D6D6D]",
    glowColor: "rgba(109, 109, 109, 0.3)",
    gradient: "linear-gradient(135deg, #EEF1F5 0%, #C8D0DC 50%, #6D6D6D 100%)",
    image: "/images/churchill.png",
    personalities: [
      `Kolay tahmin edilen biri değilsin.\nİnsanlar seni ilk bakışta çözemez.\nBelki de en güzel tarafın bu.\nMOQ bugün sana\nChurchill\nverdi.\nNadir çıkanlardan.`
    ],
    joke: "Normal olmak fazla normal geldi.",
    traits: {
      cesaret: 60,
      dinginlik: 80,
      nese: 42,
      ferahlık: 35
    },
    resultTheme: {
      tagline: "Sıradışı bir duruş, kendine has bir tat.",
      worldSubtext: "Vintage ve klasik çizgilerin eşsiz sadeliği.",
      ingredientsSubtext: "Tuz, limon ve sodanın çarpıcı dengesi.",
      jokeNormal: "Normal ve sıradan olmak ",
      jokeBold: "sana her zaman fazla sıkıcı geldi.",
      jokeEmoji: "🎩",
      bgGrad: "from-[#FDFDFE] via-[#EEF1F5]/30 to-[#D5DEEB]/40",
      accentGlow: "rgba(109, 109, 109, 0.35)",
      coreSymbol: "🧂",
      particleType: "bubbles",
      particleColor: "rgba(109, 109, 109, 0.25)"
    }
  },
  {
    id: "portakal-suyu",
    name: "PORTAKAL SUYU",
    worldName: "Narenciye Bahçesi",
    shortTitle: "ORANGE",
    subtitle: "Saf Enerji",
    story: "Doğanın en sade armağanlarından biri. Katkısız, canlı ve her yudumunda güneş taşıyan bir klasik.",
    moodMessage: "Güneşi bardağa sığdırabildik.",
    ingredients: ["Taze Portakal"],
    moods: ["Neşeli", "Canlı", "Pozitif"],
    flavorNotes: ["Taze Portakal"],
    colors: {
      primary: "#FFA726",
      secondary: "#FCE0AC",
      accent: "#FFA726",
      background: "#FFF7ED",
      particle: "#FFA726"
    },
    theme: {
      emoji: "🍊",
      icon: "fruit",
      particle: "spark",
      animation: "float",
      bgEffects: ["morning-beams", "orange-trees", "light-rays"]
    },
    mobile: {
      popupGradient: "linear-gradient(180deg, rgba(255, 167, 38, 0.18) 0%, #ffffff 60%)",
      popupGlow: "rgba(255, 167, 38, 0.25)",
      popupBackground: "#FFF7ED"
    },
    desktop: {
      worldGradient: "from-[#FFFDF9] via-[#FFF7ED]/40 to-[#FCE0AC]/55",
      parallaxIntensity: 1.2
    },
    emoji: "🍊",
    color: "#FFA726",
    bgColor: "bg-[#fff7ed]",
    textColor: "text-[#FFA726]",
    glowColor: "rgba(255, 167, 38, 0.3)",
    gradient: "linear-gradient(135deg, #FFF7ED 0%, #FDE68A 50%, #FFA726 100%)",
    image: "/images/portakal_suyu.png",
    personalities: [
      `Enerjin doğal.\nRol yapmıyorsun.\nOlduğun gibisin.\nVe bu fazlasıyla yeterli.\nBugün MOQ seni\nPortakal Suyu\nile eşleştirdi.`
    ],
    joke: "Vitamin C seviyen bizden yüksek olabilir.",
    traits: {
      cesaret: 50,
      dinginlik: 78,
      nese: 82,
      ferahlık: 68
    },
    resultTheme: {
      tagline: "Güne enerjik başla, doğal kal.",
      worldSubtext: "Geniş portakal bahçelerinin sabah güneşi.",
      ingredientsSubtext: "Sıkma taze portakallardan gelen saf C vitamini.",
      jokeNormal: "Güneş enerjini ölçemiyoruz ama ",
      jokeBold: "Vitamin C seviyen bizden yüksek olabilir.",
      jokeEmoji: "🍹",
      bgGrad: "from-[#FFFDF9] via-[#FFF7ED]/30 to-[#FCE0AC]/45",
      accentGlow: "rgba(255, 167, 38, 0.35)",
      coreSymbol: "🍊",
      particleType: "pollen",
      particleColor: "rgba(255, 167, 38, 0.3)"
    }
  }
];

export const RARE_MESSAGES: string[] = [
  "Bugün evren değil, MOQ sana göz kırptı.",
  "Bardaktaki ilk yudum bazen bütün günü değiştirebilir.",
  "Küçük bir tavsiye: Bugün kendine güzel davran.",
  "Senin enerjin bugün tam MOQ'luk.",
  "Bu sonuç sadece bugün için geçerli olabilir.\nYarın tekrar denemeye ne dersin?",
  "Arkadaşının MOQ'unu da merak etmiyor musun?",
  "QR'ı ona uzat. 😄"
];

export const MINI_JOKES: string[] = [
  "Bunu ekran görüntüsü alıp 'beni çözmüşler' diye paylaşabilirsin.",
  "Bu sonuç tamamen eğlence amaçlıdır... ama biraz fazla isabetli olabilir.",
  "Arkadaşını da denet. Belki aynı içecek çıkmaz.",
  "İkinci kez denersen belki MOQ seni yine şaşırtır.",
  "Bugünkü modun belli oldu. Şimdi sıra ilk yudumda.",
  "Bu sonuç için kahve falına bakılmadı, sadece MOQ usulü yorumlandı.",
  "Bazen bir içecek sadece içecek değildir."
];
