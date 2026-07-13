import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Gizlilik Politikası | MOQ Drink",
  description:
    "MOQ Drink gizlilik politikası — kişisel verilerinizin nasıl toplandığını, kullanıldığını ve korunduğunu öğrenin.",
};

export default function GizlilikPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0f4fc] to-white text-[#1a253c]">
      {/* Hero */}
      <div className="w-full py-20 px-6 text-center bg-gradient-to-b from-[#e0eaf8] to-transparent">
        <p className="text-[10px] font-black tracking-[0.3em] uppercase text-[#0f6cbd] mb-3">
          MOQ DRINK
        </p>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
          Gizlilik Politikası
        </h1>
        <p className="text-sm text-[#4a5568] font-medium max-w-xl mx-auto leading-relaxed">
          Verilerinize saygı duyuyoruz. Bu sayfa, kişisel bilgilerinizin nasıl
          işlendiğini açıkça anlatmaktadır.
        </p>
        <p className="mt-4 text-[10px] text-[#9ca3af] font-bold tracking-wider uppercase">
          Son Güncelleme: Temmuz 2025
        </p>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-6 py-16 space-y-12">
        <Section
          title="1. Toplanan Bilgiler"
          body="MOQ Drink web sitesini ziyaret ettiğinizde; tarayıcı türünüz, IP adresiniz ve sayfa etkileşimleriniz gibi teknik veriler anonim olarak toplanabilir. İletişim formu veya e-posta aracılığıyla bize ulaştığınızda verdiğiniz isim ve e-posta adresi yalnızca yanıt vermek amacıyla kullanılır."
        />

        <Section
          title="2. Verilerin Kullanım Amacı"
          body="Toplanan veriler; web sitesinin performansını iyileştirmek, kullanıcı deneyimini analiz etmek ve sizinle iletişim kurmak için kullanılır. Kişisel verileriniz hiçbir koşulda üçüncü taraflarla ticari amaçla paylaşılmaz veya satılmaz."
        />

        <Section
          title="3. Çerezler (Cookies)"
          body="Sitemiz, deneyiminizi geliştirmek amacıyla oturum çerezleri ve analitik araçları kullanabilir. Tarayıcı ayarlarınızdan çerezleri devre dışı bırakabilirsiniz; ancak bu, bazı özelliklerin düzgün çalışmamasına neden olabilir."
        />

        <Section
          title="4. Veri Güvenliği"
          body="Verilerinizin güvenliği için endüstri standardı önlemler alınmaktadır. HTTPS şifrelemesi ve güvenli sunucu altyapısı kullanılmaktadır. Bununla birlikte, internet üzerinden hiçbir iletimin %100 güvenli olduğu garanti edilemez."
        />

        <Section
          title="5. Üçüncü Taraf Bağlantıları"
          body="Web sitemiz Instagram gibi sosyal medya platformlarına bağlantılar içerebilir. Bu platformların kendi gizlilik politikaları mevcuttur ve MOQ Drink, bu sitelerdeki uygulamalardan sorumlu değildir."
        />

        <Section
          title="6. Haklarınız"
          body="Kişisel Verilerin Korunması Kanunu (KVKK) kapsamında; verilerinize erişme, düzeltme, silme veya işlenmesini kısıtlama haklarına sahipsiniz. Bu haklarınızı kullanmak için aşağıdaki iletişim adresimize ulaşabilirsiniz."
        />

        <Section
          title="7. İletişim"
          body={
            <span>
              Gizlilik politikamıza ilişkin sorularınız için bize{" "}
              <a
                href="mailto:muhsinsuhansari@hotmail.com"
                className="font-black text-[#0f6cbd] underline underline-offset-2 hover:opacity-75 transition-opacity"
              >
                muhsinsuhansari@hotmail.com
              </a>{" "}
              adresinden ulaşabilirsiniz.
            </span>
          }
        />

        {/* Back */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center space-x-2 text-xs font-black tracking-widest uppercase text-[#0f6cbd] hover:opacity-70 transition-opacity"
          >
            <span>←</span>
            <span>Ana Sayfaya Dön</span>
          </Link>
          <Link
            href="mailto:muhsinsuhansari@hotmail.com"
            className="inline-flex items-center text-xs font-black tracking-widest uppercase text-[#1a253c]/50 hover:text-[#0f6cbd] transition-colors"
          >
            İletişim
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  body,
}: {
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-black tracking-tight text-[#1a253c]">
        {title}
      </h2>
      <p className="text-sm text-[#4a5568] leading-relaxed font-medium">
        {body}
      </p>
    </div>
  );
}
