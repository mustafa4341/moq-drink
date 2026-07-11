/* ═══════════════════════════════════════════════════════════════
   MOQ DRINKS — Centralized Drink Data
   
   8 drinks with multiple personality variations,
   energy profiles, jokes, and visual identity.
   
   To add product images:
   1. Place image in public/images/ (e.g. merida.png)
   2. Update the `image` field below with the path
   ═══════════════════════════════════════════════════════════════ */

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
    joke: "Kahve seni uyandırmıyor.\nSen kahveyi uyandırıyorsun.",
    traits: {
      cesaret: 92,
      dinginlik: 20,
      nese: 70,
      ferahlık: 40,
    },
    ingredients: ["Hibiscus", "Çilek", "Sweet & Sour", "Limon"],
    worldName: "Lider",
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
      `Sen acele etmiyorsun.\nDoğru zamanı bekliyorsun.\nVe çoğu zaman haklı çıkıyorsun.\nBugünkü MOQ'un\nSundrop.`,
    ],
    joke: "Hava durumunu açmana gerek yok.\nSen zaten güneş getiriyorsun.",
    traits: {
      cesaret: 45,
      dinginlik: 72,
      nese: 90,
      ferahlık: 60,
    },
    ingredients: ["Mango", "Portakal", "Bal", "Gün Işığı"],
    worldName: "Sıcakkanlı",
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
    joke: "Fotoğraf çekerken gün batımını bekleyen ekipten misin?\nBiz de öyle düşünmüştük.",
    traits: {
      cesaret: 38,
      dinginlik: 85,
      nese: 65,
      ferahlık: 50,
    },
    ingredients: ["Greyfurt", "Portakal", "Rom", "Şeker"],
    worldName: "Hayalperest",
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
      `Bazı şeylerin modası geçmez.\nTıpkı senin enerjin gibi.\nBugünkü eşleşmen\nLimonata.`,
    ],
    joke: "Hayat sana limon verirse...\nSen zaten limonata içiyorsun.",
    traits: {
      cesaret: 40,
      dinginlik: 75,
      nese: 68,
      ferahlık: 70,
    },
    ingredients: ["Limon", "Şeker", "Nane", "Su"],
    worldName: "Doğal",
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
