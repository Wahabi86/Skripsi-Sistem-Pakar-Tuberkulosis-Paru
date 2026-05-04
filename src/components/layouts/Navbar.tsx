"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";

// Daftar menu scroll (Beranda, Tentang, Informasi TBC)
const scrollLinks = [
  { label: "Beranda", sectionId: "beranda" },
  { label: "Tentang", sectionId: "tentang" },
  { label: "Informasi TBC", sectionId: "informasi-tbc" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  // Fungsi scroll ke section berdasarkan id
  const handleScrollLink = (sectionId: string) => {
    if (sectionId === "beranda") {
      // Beranda = scroll ke paling atas halaman
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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo-paru.png" alt="Logo TBCheck" width={40} height={40} className="object-contain" />
          <span className="font-extrabold text-2xl tracking-tight">
            <span className="text-gray-800">TBCheck</span>
          </span>
        </Link>

        {/* Menu */}
        <ul className="flex items-center gap-8">
          {/* Menu scroll: Beranda, Tentang, Informasi TBC */}
          {scrollLinks.map((link) => (
            <li key={link.sectionId}>
              <button
                onClick={() => handleScrollLink(link.sectionId)}
                className="relative text-lg font-medium text-gray-500 hover:text-[#2F8F8B] transition-colors duration-300 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:bg-[#2F8F8B] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}

          {/* Tombol Konsultasi - tampil berbeda */}
          <li>
            <Link
              href="/konsultasi"
              className="inline-flex items-center bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-base px-5 py-2.5 rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5"
            >
              Konsultasi
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
