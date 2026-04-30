import { RiLungsLine } from "react-icons/ri";
import { LuClipboardPlus, LuHeartPulse, LuBookOpen, LuShieldCheck, LuLockKeyhole } from "react-icons/lu";
import { MdOutlineWatchLater } from "react-icons/md";
import { FiArrowRight } from "react-icons/fi";
import { PiTarget } from "react-icons/pi";
import Image from "next/image";
import Link from "next/link";

const cards = [
  {
    icon: <RiLungsLine className="text-6xl text-[#277C78]" />,
    title: "Kenali Gejala",
    desc: "Kenali gejala Tuberkulosis Paru sejak awal sebelum bertambah parah.",
  },
  {
    icon: <LuShieldCheck className="text-6xl text-[#2F8F8B]" />,
    title: "Cegah Penularan",
    desc: "Deteksi dini membantu mencegah penularan ke orang terdekat.",
  },
  {
    icon: <LuClipboardPlus className="text-6xl text-[#2F8F8B]" />,
    title: "Tindakan Tepat",
    desc: "Semakin cepat diketahui, semakin besar peluang kesembuhan.",
  },
  {
    icon: <LuHeartPulse className="text-6xl text-[#2F8F8B]" />,
    title: "Lindungi Hidup",
    desc: "Jaga kesehatan paru demi hidup yang lebih sehat dan berkualitas.",
  },
];

const features = [
  {
    icon: <MdOutlineWatchLater className="text-6xl text-blue-400" />,
    title: "Periksa 3 Menit",
    desc: "Selesai cepat dan praktis",
  },
  {
    icon: <PiTarget className="text-6xl text-amber-500" />,
    title: "Akurat",
    desc: "Dibuat berdasarkan referensi medis",
  },
  {
    icon: <LuLockKeyhole className="text-6xl text-emerald-500" />,
    title: "Aman Tanpa Data",
    desc: "Tidak ada data pribadi yang diminta atau disimpan",
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero Section*/}
      <section className="relative py-10 overflow-hidden">
        <div className="relative max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center gap-12">
          {/* Kiri - Teks & Tombol */}
          <div className="flex-1 flex flex-col items-start">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#2F8F8B]/8 border border-[#2F8F8B]/25 rounded-full px-4 py-1.5 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#2F8F8B]" />
              <span className="text-sm font-medium text-[#2F8F8B] tracking-wide">Selamat datang di TBCheck</span>
            </div>

            {/* Judul */}
            <h1 className="text-5xl font-extrabold text-gray-800 leading-tight mb-6">
              <span className="whitespace-nowrap">
                Deteksi Dini <span className="text-[#2F8F8B]">TBC Paru,</span>
              </span>
              <br />
              Lindungi <span className="text-[#2F8F8B]">Hidupmu.</span>
            </h1>

            {/* Deskripsi */}
            <p className="text-gray-500 text-xl mb-10 max-w-lg">TBCheck membantu kamu melakukan pemeriksaan awal risiko Tuberkulosis Paru dengan cepat, mudah dan terpercaya.</p>

            {/* Tombol */}
            <div className="flex flex-wrap gap-4">
              <Link
                href="/konsultasi"
                className="inline-flex items-center gap-2 bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5"
              >
                Mulai Skrining
                <FiArrowRight className="text-lg" />
              </Link>

              <Link
                href="/informasi-tbc"
                className="inline-flex items-center gap-2 border border-[#2F8F8B]/40 hover:border-[#2F8F8B] bg-white/60 hover:bg-white text-gray-700 hover:text-[#2F8F8B] font-semibold text-lg px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                Pelajari TBC Paru
                <LuBookOpen className="text-lg" />
              </Link>
            </div>
          </div>

          {/* KANAN — Gambar Paru */}
          <div className="flex-1 flex justify-center items-center relative">
            <div className="absolute w-80 h-80 bg-[#2F8F8B]/12 rounded-full blur-2xl pointer-events-none" />
            <Image src="/icon-paru.png" alt="Ilustrasi Paru-paru" width={0} height={0} sizes="100vw" className="relative w-full max-w-xl object-contain drop-shadow-xl scale-200" />
          </div>
        </div>
      </section>

      {/* Section Keunggulan TBCheck*/}
      <section className="relative max-w-6xl mx-auto px-6 mt-4 mb-8">
        <div className="w-full h-1 bg-linear-to-r from-transparent via-gray-300 to-transparent mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-3">
          {features.map((item, index, arr) => (
            <div key={index} className="relative flex items-start gap-5 px-10 py-8">
              {/* Garis vertikal gradient */}
              {index !== arr.length - 1 && <div className="absolute right-0 top-0 h-full w-1 bg-linear-to-b from-transparent via-gray-300 to-transparent" />}

              {/* Icon dengan background */}
              <div className="shrink-0 w-16 h-16 flex items-center justify-center">{item.icon}</div>
              <div>
                <p className="font-bold text-gray-800 text-lg mb-1">{item.title}</p>
                <p className="text-gray-500 text-base">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Kartu Deteksi Penting*/}
      <section className="py-10 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Judul */}
          <h2 className="text-center text-4xl font-bold text-gray-800 mb-3">Kenapa Deteksi Dini Itu Penting?</h2>
          <div className="flex justify-center mb-10">
            <div className="w-12 h-1 bg-[#2F8F8B] rounded" />
          </div>

          {/* 4 Kartu */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {cards.map((card, index) => (
              <div key={index} className="group bg-white border border-gray-100 shadow-sm hover:shadow-md rounded-2xl p-6 flex flex-col items-center text-center transition-all duration-300 hover:-translate-y-1">
                <div className="bg-[#EAF6F6] p-6 rounded-full mb-4 transition-colors duration-300 group-hover:bg-[#2F8F8B]/15">{card.icon}</div>
                <h3 className="font-bold text-gray-800 mb-2 text-lg">{card.title}</h3>
                <p className="text-gray-500 text-base">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
