## Sahilin Nabzı — Güncellenmiş Plan (Memory-Board UX)

### Felsefe: sosyal medya akışı DEĞİL → yaşayan bir "anı panosu"
Bu bölüm InstagramFeed'in gösterişli estetiğini kullanmaz. Aynı design token'lar (`text-brand-navy`, `text-brand-slate`, krem body `#fdf7f4`, mavi akşent, Manrope) kalır; sadece yoğunluk düşer: sade beyaz kartlar, `translateY(-2px)` hover, orta boy başlık, gevşek değil sıcak boşluk.

### Mimari DEĞİŞMEDİ — Repository Pattern (önceki cevap onaylı)
```
CommunitySection → useCommunityFeed → CommunityRepository
                                          │
                              ┌───────────┴────────────┐
                              ▼                        ▼
                    MockCommunityRepository   SupabaseCommunityRepository
```
Dosya yapısı Hybrid (7 dosya): `types/community.ts`, `lib/supabase.ts`, `lib/community.ts`, `hooks/useCommunityFeed.ts`, `components/community/{CommunitySection, CommunityComposer, CommunityFeed, CommunityCard}.tsx`. Supabase dormant (env yok → otomatik mock). BeachSelector/Username/Message input'ları `Composer` içinde inline.

---

### Spesifikasyon → Uygulama eşlemesi

| # | Spesifikasyon | Uygulama |
|---|---|---|
| 1 | Bölüm ~700-900px başlar, içerikle büyür, gereksiz boşluk yok | Section padding `pt-12 md:pt-24 pb-16 md:pb-24` (InstagramFeed'in `py-40`'u DEĞIL) |
| 2 | "🌊 Sahilin Nabzı" başlığı büyük değil ama okunaklı | `text-3xl md:text-5xl font-black text-brand-navy tracking-tight` — küçük harf, `.type-scene-title` clamp'i DEĞIL |
| 3 | "Bir sahil... Bir içecek... Bir anı..." girişi | `page.tsx`'te InstagramFeed sonrası `<TransitionText lines={["Bir sahil...", "Bir içecek...", "Bir anı..."]} />` (mevcut desen) |
| 4 | Açıklama = paylaşmaya teşvik | "Burada bugün yaşadığın küçük bir anı bırak. Belki yarın biri aynı yerde senin mesajını okuyacak." `.type-body text-brand-slate` |
| 5 | Composer ilk görünen | Header → Composer → (filtre) → Feed sırası |
| 6 | Username tek satır, placeholder "Kullanıcı adın" | MoodFinder underline stili, `validateUsername` live (3-20, `[A-Za-z0-9_]`) |
| 7 | Sahil dropdown 📍 Fıstıklı | Native `<select>` sade stilli, `BEACHES` |
| 8 | Büyük textarea, 3 satırlık placeholder | `<textarea rows={4}>`, `validateMessage` (5-220) |
| 9 | Karakter sayacı alt sağ "45 / 220" | Canlı sayaç, 200+ kırmızı vurgu |
| 10 | Paylaş → "✔ Paylaşıldı" animasyonu | `submitState: idle\|submitting\|success`; success 1.5s sonra reset + form temizlenir |
| 11 | Kart 120-150px, beyaz, hover çok hafif | `bg-white/80 border border-black/5 shadow-[0_4px_20px_rgba(26,37,60,0.04)] hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(26,37,60,0.08)]` — gleam/scale YOK |
| 12 | Kart başlık: 👤 isim, 📍 sahil, 🕒 zaman, ince çizgi, mesaj | Meta satırı "📍 Fıstıklı · 🕒 3 dakika önce" müteakip, username `font-black text-brand-navy` + ince divider |
| 13 | Emoji çok az | Sadece 📍/🕒/🌊, fazla emoji yok |
| 14 | Arka plan çok açık krem | Body `#fdf7f4` zaten global (WorldBackground) — otomatik sağlanır |
| 15 | Mobil tam genişlik, 16px boşluk | Tek kolon, `gap-4` |
| 16 | Desktop max 900px ortalanmış | `max-w-[900px] mx-auto` |
| 17 | Sayfa açılışı: title fade → composer yukarı → kartlar stagger | Framer Motion `useInView`, `ease [0.16,1,0.3,1]` |
| 18 | Yeni paylaşım: "Gönderiliyor..." sonra hafif yukarı | Buton submitting state + `<motion.div layout>`/`AnimatePresence` ile kart `y:-12→0` |
| 19 | Realtime: "Yeni paylaşım geldi" kapsülü, tıkla kaydır (zıplama yok) | `pendingPosts[]` + `revealPending()` — başkasının post'u kapsüle gider, kullanıcının kendi post'u direkt prepend |
| 20 | Loading: gri skeleton, gerçek kartın aynısı | `animate-pulse` gri çubuklar, aynı kart iskeleti |
| 21 | Empty: "🌊 Henüz kimse paylaşım yapmadı. Bugünün ilk anısını sen bırak." | `posts.length===0 && status==='ready'` |
| 22 | Hata: "Bağlantı kurulamadı. Tekrar dene." | `status==='error'` + retry butonu (`retry()` hook'tan) |
| 23 | Spam: 220 karakter, >3 satır "Devamını Oku" | `line-clamp-3` + `expanded` local state, "Devamını Oku" / "Daha az" |
| 24 | Filtre: Tümü / Fıstıklı / Armutlu / Altınkum | `CommunityFeed` içinde pill filtre satırı, client-side view filter (`activeBeach: Beach\|'all'`) |
| 25 | Desktop'ta composer üstte, yeni mesajda liste kaymaz | Realtime kapsülü (madde 19) zaten bunu sağlar |
| 26 | Mobil: Başlık → Paylaşım → Gönder → Kartlar | Stack sırası korunur |
| 27 | Floating placeholder (yazınca yukarı kayar) | Inline floating-label: input value/focus'ta label `top`+`scale-75`+soluk |
| 28 | Buton alanlar dolana kadar pasif, dolunca hafif parlama | `disabled={!valid}`, pasif: `opacity-50 cursor-not-allowed`; aktif: yumuşak mavi glow `shadow-[0_0_24px_rgba(56,139,230,0.25)]` |
| 29 | Sadece buton "✔ Paylaşıldı" olur, tüm form değişmez | Madde 10 ile aynı |
| 30 | Ton: "Bugün nasıl geçti?" gibi samimi, sosyal medya dili değil | Placeholder + açıklama metinleri bu tonla yazılır |

---

### `useCommunityFeed.ts` — durum modeli (yeni UX'i yansıtır)
- State: `posts: BeachPost[]`, `status: 'loading'|'ready'|'error'`, `error`, `pendingPosts: BeachPost[]` (realtime bekleyen), `lastPostAt: number|null`, `rateLimitRemainingSec`.
- `fetchPosts(20)` mount'ta → `posts`. Hata → `status='error'`.
- `subscribeToInserts` → **başka kullanıcının** post'unu `pendingPosts`'a ekler (kapsül). `revealPending()` → `pendingPosts`'u `posts` başına taşır, temizler. Mock modda sessiz no-op (sahte yayın yok — sakin/dürüst; `MOCK_REALTIME_ENABLED` sabiti ile opsiyonel preview).
- `addPost(input): Promise<{ok:true}|{ok:false,error:string}>` → validasyon + küfür; kullanıcının KENDİ post'u **direkt** `posts` başına (beklenir, kapsüle değil). Rate-limit (30sn) `lastPostAt` + localStorage mirror.
- `retry()` → fetchPosts'u yeniden çalıştırır.
- Unmount'ta unsubscribe.

### `lib/community.ts`
- `MockCommunityRepository`: ~8 gerçekçi Türkçe sahil postu seed (Fıstıklı/Armutlu/Altınkum/Kumla karışık), `fetchPosts` (~300ms simüle gecikme, en yeni önce), `createPost` (validasyon + uuid + prepend), `subscribeToInserts` sessiz no-op (opsiyonel preview sabiti).
- `SupabaseCommunityRepository`: `select('*').order(created_at desc).limit`, `insert().select().single()`, `channel().on('postgres_changes',{event:'INSERT'})` **sadece INSERT**. Dormant.
- `getCommunityRepository()` singleton factory — TEK switch noktası.
- Helper'lar: `validateUsername/Message`, `containsProfanity` (minimal TR liste), `formatRelativeTime` ("Az önce"/"X dakika önce"/"X saat önce"/"Dün"/"X gün önce"), `canPostAgain`.

### `lib/supabase.ts` — dormant
`getSupabase()`: env yok → `null`; varsa `await import("@supabase/supabase-js")` ile `createClient`. Minimal `SupabaseClientLike` tipi → paket tip bağımlılığı yok (`@ts-expect-error` + net yorum).

### `page.tsx` (tek düzenleme)
```tsx
<InstagramFeed />
<TransitionText lines={["Bir sahil...", "Bir içecek...", "Bir anı..."]} align="center" />
<CommunitySection />
</main>
```

### Sonradan (UI'a dokunmadan)
1. `npm i @supabase/supabase-js` 2. `.env.local` → URL+anon 3. Supabase dashboard'da `supabase/migrations/0001_beach_posts.sql` (table + RLS anon insert/select + realtime publication) → feed otomatik canlıya geçer, kapsül çalışır.

### Doğrulama
Typecheck/build (`tsc --noEmit` veya `npm run build`) ile derleme kontrolü; site geri kalanını kırmadığından emin. Mevcut commit branch'i `feature/moq-mobile-v2`.