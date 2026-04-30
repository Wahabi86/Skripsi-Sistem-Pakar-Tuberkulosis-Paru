"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Konsultasi", href: "/konsultasi" },
  { label: "Informasi TBC", href: "/informasi-tbc" },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
        {/* Logo / Nama Aplikasi */}
        <Link href="/" className="flex items-center gap-1">
          <Image src="/logo-paru.png" alt="Logo TBCheck" width={40} height={40} className="object-contain" />
          <span className="font-extrabold text-2xl tracking-tight">
            <span className="text-gray-800">TBCheck</span>
          </span>
        </Link>

        {/* Menu Links */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`relative text-lg font-medium transition-colors duration-300 after:absolute after:left-0 after:-bottom-2 after:h-0.5 after:w-full after:transition-transform after:duration-300 after:origin-center ${pathname === link.href ? "text-[#2F8F8B] after:bg-[#2F8F8B] after:scale-x-100" : "text-gray-500 after:bg-[#2F8F8B] after:scale-x-0 hover:text-[#2F8F8B] hover:after:scale-x-100"}`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
