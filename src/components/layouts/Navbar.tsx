"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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
        <Link href="/" className="text-blue-600 font-extrabold text-2xl tracking-widest uppercase">
          TBCheck
        </Link>

        {/* Menu Links */}
        <ul className="flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`text-lg font-medium pb-1 transition-all duration-200
                  ${pathname === link.href ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-500 border-b-2 border-transparent hover:text-blue-600 hover:border-blue-600"}`}
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
