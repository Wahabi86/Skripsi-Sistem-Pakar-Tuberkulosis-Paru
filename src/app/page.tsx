"use client";

import { LuBookOpen } from "react-icons/lu";
import { FiArrowRight } from "react-icons/fi";
import { FaLongArrowAltRight } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    icon: "/clock.png",
    title: "Periksa 3 Menit",
    desc: "Selesai cepat dan praktis",
  },
  {
    icon: "/goal.png",
    title: "Akurat",
    desc: "Dibuat berdasarkan referensi medis",
  },
  {
    icon: "/padlock.png",
    title: "Aman Tanpa Data",
    desc: "Tidak ada data pribadi yang diminta atau disimpan",
  },
];

const steps = [
  {
    icon: "/medical-check.png",
    title: "Jawab Pertanyaan",
    desc: "Isi kuesioner gejala yang kamu alami",
  },
  {
    icon: "/pie-chart.png",
    title: "Proses Analisis",
    desc: "Sistem akan menganalisis berdasarkan gejala",
  },
  {
    icon: "/report-card.png",
    title: "Lihat Hasil",
    desc: "Dapatkan hasil diagnosis awal dan rekomendasi tindakan lanjut",
  },
  {
    icon: "/hospital.png",
    title: "Tindak Lanjut",
    desc: "Kunjungi fasilitas kesehatan terdekat jika diperlukan",
  },
];

const cards = [
  {
    icon: "/lungs2.png",
    title: "Kenali Gejala",
    desc: "Mengenali gejala sejak dini sebelum bertambah parah.",
  },
  {
    icon: "/shield1.png",
    title: "Cegah Penularan",
    desc: "Mencegah penularan ke keluarga dan lingkungan.",
  },
  {
    icon: "/medical-checkup.png",
    title: "Tindakan Tepat",
    desc: "Mendapatkan tindakan dan pengobatan yang tepat secepatnya.",
  },
  {
    icon: "/heart-rate.png",
    title: "Lindungi Hidup",
    desc: "Melindungi kesehatan diri sendiri dan orang tersayang.",
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

          {/* Kanan - Gambar Paru */}
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
              
              {/* Icon */}
              <div className="shrink-0 w-16 h-16 flex items-center justify-center">
                <Image src={item.icon} alt={item.title} width={56} height={56} className="object-contain" />
              </div>
              <div>
                <p className="font-bold text-gray-800 text-lg mb-1">{item.title}</p>
                <p className="text-gray-500 text-base">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Section Cara Kerja Sistem */}
      <section className="py-14 bg-white rounded-tl-[5rem] rounded-tr-[5rem]">
        <div className="max-w-6xl mx-auto px-6">
          {/* Judul */}
          <h2 className="text-center text-4xl font-bold text-gray-800 mb-3">Bagaimana TBCheck Bekerja?</h2>
          <div className="flex justify-center mb-12">
            <div className="w-12 h-1 bg-[#2F8F8B] rounded" />
          </div>

          {/* Langkah-langkah */}
          <div className="flex flex-col md:flex-row items-start justify-center gap-6">
            {steps.map((step, index, arr) => (
              <div key={index} className="flex items-start gap-6">
                {/* Kartu langkah */}
                <div className="flex flex-col items-center text-center w-72">
                  {/* Icon dengan background lingkaran */}
                  <div className="w-36 h-36 rounded-full bg-[#EAF6F6] flex items-center justify-center mb-6 shadow-sm">
                    <Image src={step.icon} alt={step.title} width={88} height={88} className="object-contain" />
                  </div>
                  {/* Teks */}
                  <p className="font-bold text-gray-800 text-xl mb-2">{step.title}</p>
                  <p className="text-gray-500 text-lg leading-relaxed">{step.desc}</p>
                </div>

                {/* Panah antar langkah */}
                {index !== arr.length - 1 && (
                  <div className="hidden md:flex items-center mt-16">
                    <FaLongArrowAltRight className="text-4xl text-[#2F8F8B]/40 shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section Kenapa Deteksi Dini Penting */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center gap-16">
            {/* Kiri - Gambar */}
            <div className="flex-1 flex justify-center items-center relative">
              {/* Dekorasi + simbol */}
              <span className="absolute top-6 left-8 text-[#2F8F8B]/30 text-2xl font-bold pointer-events-none select-none">+</span>
              <span className="absolute top-16 right-12 text-[#2F8F8B]/20 text-xl font-bold pointer-events-none select-none">+</span>
              <span className="absolute bottom-10 left-16 text-[#2F8F8B]/20 text-xl font-bold pointer-events-none select-none">+</span>

              {/* Gambar */}
              <Image src="/man.png" alt="Ilustrasi Deteksi Dini" width={0} height={0} sizes="100vw" className="relative w-full max-w-145 object-contain scale-150" />
            </div>

            {/* Kanan - Judul + Cards */}
            <div className="flex-1 flex flex-col">
              {/* Judul */}
              <h2 className="text-4xl font-bold text-gray-800 mb-3 whitespace-nowrap">
                Kenapa <span className="text-[#2F8F8B]">Deteksi Dini</span> Itu Penting?
              </h2>

              {/* Garis hijau pendek di bawah judul */}
              <div className="w-16 h-1 bg-[#2F8F8B] rounded mb-8" />

              {/* Cards */}
              <div className="flex flex-col gap-4">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-5 bg-gray-50 border border-gray-100 rounded-2xl px-5 py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#2F8F8B]/30 hover:bg-white hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="bg-[#EAF6F6] border border-gray-100 p-3 rounded-full shrink-0">
                      <Image src={card.icon} alt={card.title} width={44} height={44} className="object-contain" />
                    </div>
                    {/* Teks */}
                    <div>
                      <p className="font-bold text-gray-800 text-xl mb-1">{card.title}</p>
                      <p className="text-gray-500 text-base leading-relaxed">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
