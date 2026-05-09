"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";

const scrollLinks = [
  { label: "Beranda", sectionId: "beranda" },
  { label: "Tentang", sectionId: "tentang" },
  { label: "Informasi TBC", sectionId: "informasi-tbc" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleScrollLink = (sectionId: string) => {
    setMenuOpen(false); // tutup menu saat klik
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
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 md:px-8 py-4 md:py-5 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo-paru.png" alt="Logo TBCheck" width={34} height={34} className="object-contain md:w-10 md:h-10" />
          <span className="font-extrabold text-xl md:text-2xl tracking-tight text-gray-800">TBCheck</span>
        </Link>

        {/* Menu Desktop */}
        <ul className="hidden md:flex items-center gap-8">
          {scrollLinks.map((link) => (
            <li key={link.sectionId}>
              <button
                onClick={() => handleScrollLink(link.sectionId)}
                className="relative text-base lg:text-lg font-medium text-gray-500 hover:text-[#2F8F8B] transition-colors duration-300 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:bg-[#2F8F8B] after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-300 after:origin-center cursor-pointer"
              >
                {link.label}
              </button>
            </li>
          ))}
          <li>
            <Link
              href="/konsultasi"
              className="inline-flex items-center bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-sm lg:text-base px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5"
            >
              Konsultasi
            </Link>
          </li>
        </ul>

        {/* Tombol Hamburger */}
        <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-gray-600 hover:text-[#2F8F8B] hover:bg-[#EAF6F6] transition-colors duration-200" aria-label="Toggle menu">
          {menuOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-5 py-4 flex flex-col gap-3 shadow-md">
          {scrollLinks.map((link) => (
            <button
              key={link.sectionId}
              onClick={() => handleScrollLink(link.sectionId)}
              className="text-left text-base font-medium text-gray-600 hover:text-[#2F8F8B] py-2 border-b border-gray-50 transition-colors duration-200 cursor-pointer"
            >
              {link.label}
            </button>
          ))}
          <Link
            href="/konsultasi"
            onClick={() => setMenuOpen(false)}
            className="mt-2 inline-flex justify-center items-center bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-base px-5 py-3 rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300"
          >
            Konsultasi
          </Link>
        </div>
      )}
    </nav>
  );
}
