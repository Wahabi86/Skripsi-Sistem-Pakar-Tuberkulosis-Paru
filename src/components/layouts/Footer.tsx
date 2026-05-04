"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

// Daftar menu
const scrollLinks = [
  { label: "Beranda", sectionId: "beranda" },
  { label: "Tentang", sectionId: "tentang" },
  { label: "Informasi TBC", sectionId: "informasi-tbc" },
];

export default function Footer() {
  const pathname = usePathname();
  const router = useRouter();

  // Fungsi scroll
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
      <div className="max-w-6xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_0.8fr_2fr] gap-16">
          {/* TBCheck */}
          <div className="flex flex-col">
            <span className="text-2xl font-extrabold text-[#2F8F8B] mb-3">TBCheck</span>
            <div className="w-10 h-0.5 bg-[#2F8F8B] rounded mb-5" />
            <p className="text-gray-500 text-base leading-relaxed text-justify">
              Sistem deteksi dini Tuberkulosis Paru berbasis kecerdasan buatan yang dirancang untuk membantu masyarakat melakukan penilaian awal secara mandiri dan informatif.
            </p>
          </div>

          {/* Navigasi */}
          <div className="flex flex-col items-center">
            <div className="flex flex-col w-fit">
              <span className="text-xl font-bold text-[#2F8F8B] mb-3">Navigasi</span>
              <div className="w-10 h-0.5 bg-[#2F8F8B] rounded mb-5" />
              <ul className="flex flex-col gap-3">
                {/* Menu scroll */}
                {scrollLinks.map((item) => (
                  <li key={item.sectionId}>
                    <button onClick={() => handleScrollLink(item.sectionId)} className="flex items-center gap-2 text-gray-500 hover:text-[#2F8F8B] transition-colors duration-200 text-base cursor-pointer">
                      <span className="text-[#2F8F8B] font-bold">›</span>
                      {item.label}
                    </button>
                  </li>
                ))}

                {/* Konsultasi */}
                <li>
                  <Link href="/konsultasi" className="flex items-center gap-2 text-gray-500 hover:text-[#2F8F8B] transition-colors duration-200 text-base">
                    <span className="text-[#2F8F8B] font-bold">›</span>
                    Konsultasi
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Detail Proyek */}
          <div className="flex flex-col">
            <span className="text-xl font-bold text-[#2F8F8B] mb-3">Detail Proyek</span>
            <div className="w-10 h-0.5 bg-[#2F8F8B] rounded mb-5" />
            <p className="text-gray-500 text-base leading-relaxed text-justify">
              Skripsi Teknologi Informasi yang mengembangkan sistem pakar berbasis website untuk diagnosis dini TBC Paru, menggunakan metode Forward Chaining, Certainty Factor, dan penjelasan hasil berbasis RAG-LLM.
            </p>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="border-t border-[#2F8F8B]/30 bg-[#D9E8E8]">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-gray-500 text-sm text-center md:text-left">© {new Date().getFullYear()} TBCheck</p>
          <p className="text-gray-500 text-sm text-center md:text-right">Dibuat untuk keperluan akademik &mdash; Skripsi Teknologi Informasi UNDIKNAS</p>
        </div>
      </div>
    </footer>
  );
}
