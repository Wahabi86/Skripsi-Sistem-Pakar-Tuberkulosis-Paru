"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const scrollLinks = [
  { label: "Beranda", sectionId: "beranda" },
  { label: "Tentang", sectionId: "tentang" },
  { label: "Informasi TBC", sectionId: "informasi-tbc" },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  const handleScrollLink = (sectionId: string) => {
    if (sectionId === "beranda") {
      if (pathname === "/") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        router.push("/");
      }
      return;
    }
    if (pathname === "/") {
      const el = document.getElementById(sectionId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${sectionId}`);
    }
  };

  return (
    <footer className="bg-[#F0F5F5] border-t border-[#2F8F8B]/20">
      <div className="max-w-6xl mx-auto px-5 md:px-6 py-10 md:py-14">
        {/* Grid: mobile = 1 kolom, tablet ke atas = 3 kolom */}
        <div className="grid grid-cols-1 md:grid-cols-[2fr_0.8fr_2fr] gap-8 md:gap-16">
          {/* Kolom 1: TBCheck */}
          <div className="flex flex-col">
            <span className="text-xl md:text-2xl font-extrabold text-[#2F8F8B] mb-3">TBCheck</span>
            <div className="w-10 h-0.5 bg-[#2F8F8B] rounded mb-4 md:mb-5" />
            <p className="text-gray-500 text-sm md:text-base leading-relaxed text-justify">
              Sistem deteksi dini Tuberkulosis Paru berbasis kecerdasan buatan yang dirancang untuk membantu masyarakat melakukan penilaian awal secara mandiri dan informatif.
            </p>
          </div>

          {/* Kolom 2: Navigasi */}
          <div className="flex flex-col md:items-center">
            <div className="flex flex-col w-fit">
              <span className="text-lg md:text-xl font-bold text-[#2F8F8B] mb-3">Navigasi</span>
              <div className="w-10 h-0.5 bg-[#2F8F8B] rounded mb-4 md:mb-5" />
              <ul className="flex flex-col gap-2 md:gap-3">
                {scrollLinks.map((item) => (
                  <li key={item.sectionId}>
                    <button onClick={() => handleScrollLink(item.sectionId)} className="flex items-center gap-2 text-gray-500 hover:text-[#2F8F8B] transition-colors duration-200 text-sm md:text-base cursor-pointer">
                      <span className="text-[#2F8F8B] font-bold">›</span>
                      {item.label}
                    </button>
                  </li>
                ))}
                <li>
                  <Link href="/konsultasi" className="flex items-center gap-2 text-gray-500 hover:text-[#2F8F8B] transition-colors duration-200 text-sm md:text-base">
                    <span className="text-[#2F8F8B] font-bold">›</span>
                    Konsultasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Kolom 3: Detail Proyek */}
          <div className="flex flex-col">
            <span className="text-lg md:text-xl font-bold text-[#2F8F8B] mb-3">Detail Proyek</span>
            <div className="w-10 h-0.5 bg-[#2F8F8B] rounded mb-4 md:mb-5" />
            <p className="text-gray-500 text-sm md:text-base leading-relaxed text-justify">
              Skripsi Teknologi Informasi yang mengembangkan sistem pakar berbasis website untuk diagnosis dini TBC Paru, menggunakan metode Forward Chaining, Certainty Factor, dan penjelasan hasil berbasis RAG-LLM.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#2F8F8B]/30 bg-[#D9E8E8]">
        <div className="max-w-6xl mx-auto px-5 md:px-6 py-3 md:py-4 flex flex-col md:flex-row items-center justify-between gap-1 md:gap-2">
          <p className="text-gray-500 text-xs md:text-sm text-center md:text-left">© {new Date().getFullYear()} TBCheck</p>
          <p className="text-gray-500 text-xs md:text-sm text-center md:text-right">Dibuat untuk keperluan akademik &mdash; Skripsi Teknologi Informasi UNDIKNAS</p>
        </div>
      </div>
    </footer>
  );
}
