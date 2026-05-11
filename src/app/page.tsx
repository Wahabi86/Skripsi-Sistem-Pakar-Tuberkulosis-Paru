"use client";

import { FiArrowRight } from "react-icons/fi";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Footer from "@/components/layouts/Footer";

const features = [
  {
    icon: "/clock.png",
    title: "Periksa 3 - 5 Menit",
    desc: "Selesai cepat dan praktis",
  },
  {
    icon: "/goal.png",
    title: "Akurat",
    desc: "Dibuat berdasarkan referensi medis",
  },
  {
    icon: "/padlock.png",
    title: "Privasi Terjaga",
    desc: "Data anda hanya digunakan untuk kepentingan penelitian",
  },
];

const steps = [
  {
    icon: "/medical-check.png",
    title: "Jawab Pertanyaan",
    desc: "Isi kuesioner gejala yang kamu alami",
  },
  {
    icon: "/process.png",
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
    desc: "Mengenali gejala Tuberkulosis Paru sejak dini sebelum bertambah parah.",
  },
  {
    icon: "/shield1.png",
    title: "Cegah Penularan",
    desc: "Mencegah penularan ke keluarga, teman dan lingkungan sekitar.",
  },
  {
    icon: "/medical-checkup.png",
    title: "Tindakan Tepat",
    desc: "Mendapatkan tindakan dan pengobatan yang tepat secepatnya.",
  },
  {
    icon: "/heart-rate.png",
    title: "Lindungi Hidup",
    desc: "Melindungi kesehatan diri sendiri dan orang tersayang untuk masa depan yang lebih baik.",
  },
];

const faqs = [
  {
    question: "Apa itu TBC Paru dan bagaimana cara penularannya?",
    answer:
      "TBC Paru adalah penyakit infeksi menular yang disebabkan oleh bakteri Mycobacterium Tuberculosis. Penyakit ini menyebar melalui udara saat penderita batuk, bersin, atau berbicara, sehingga sangat mudah menular di lingkungan padat penduduk.",
  },
  {
    question: "Apa saja gejala awal TBC Paru yang perlu diwaspadai?",
    answer:
      "Gejalanya mencakup batuk lebih dari 2 minggu, batuk berdahak, batuk berdarah, nyeri dada, sesak napas, lelah atau lemas, penurunan berat badan, nafsu makan menurun, demam, dan berkeringat di malam hari. Gejala ini sering mirip dengan penyakit pernapasan lain, jadi kombinasi beberapa gejala sekaligus patut diwaspadai.",
  },
  {
    question: "Apakah hasil diagnosis dari sistem ini bisa menggantikan pemeriksaan dokter?",
    answer:
      "Tidak, sistem ini hanya berfungsi sebagai alat bantu deteksi dini dan penilaian awal secara mandiri. Hasil yang diberikan bukan diagnosis medis resmi. Pengguna tetap dianjurkan untuk melakukan pemeriksaan lebih lanjut ke fasilitas kesehatan untuk konfirmasi dan penanganan yang tepat.",
  },
];

function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="flex flex-col gap-3 md:gap-4">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;
        return (
          <div key={index} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? "border-[#2F8F8B]/40 shadow-md shadow-[#2F8F8B]/10" : "border-gray-100 shadow-sm"} bg-white`}>
            {/* Pertanyaan */}
            <button onClick={() => toggle(index)} className="w-full flex items-center justify-between px-4 md:px-6 py-4 md:py-5 text-left group cursor-pointer">
              <span className={`font-semibold text-base md:text-lg transition-colors duration-300 ${isOpen ? "text-[#2F8F8B]" : "text-gray-800"}`}>{faq.question}</span>
              <span
                className={`ml-3 md:ml-4 shrink-0 w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                  isOpen ? "bg-[#2F8F8B] text-white rotate-180" : "bg-gray-100 text-gray-400 group-hover:bg-[#EAF6F6] group-hover:text-[#2F8F8B]"
                }`}
              >
                <IoIosArrowDown className="text-base md:text-lg" />
              </span>
            </button>

            {/* Jawaban */}
            <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
              <div className="overflow-hidden">
                <p className="px-4 md:px-6 pb-4 md:pb-5 text-gray-500 text-sm md:text-base leading-relaxed border-t border-gray-100 pt-3 md:pt-4">{faq.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function Home() {
  return (
    <div>
      {/* HERO SECTION */}
      <section id="beranda" className="relative overflow-hidden scroll-mt-20 py-10 md:py-12 lg:py-10">
        <div className="relative max-w-6xl mx-auto px-5 md:px-8 lg:px-6 flex flex-col md:flex-row items-center gap-8 md:gap-8 lg:gap-12">
          {/* Kiri - Teks & Tombol */}
          <div className="flex-1 flex flex-col items-start w-full">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#2F8F8B]/8 border border-[#2F8F8B]/25 rounded-full px-4 py-1.5 mb-5 md:mb-4">
              <div className="w-2 h-2 rounded-full bg-[#2F8F8B] shrink-0" />
              <span className="text-xs md:text-sm font-medium text-[#2F8F8B] tracking-wide">Selamat datang di TBCheck</span>
            </div>

            {/* Judul */}
            <h1 className="font-extrabold text-gray-800 leading-tight mb-4 md:mb-5 lg:mb-6 text-[1.6rem] md:text-3xl lg:text-5xl">
              <span className="whitespace-nowrap">
                Deteksi Dini <span className="text-[#2F8F8B]">TBC Paru,</span>
              </span>
              <br />
              Lindungi <span className="text-[#2F8F8B]">Hidupmu.</span>
            </h1>

            {/* Deskripsi */}
            <p className="text-gray-500 leading-relaxed mb-7 md:mb-8 lg:mb-10 text-sm md:text-base lg:text-xl max-w-lg">TBCheck membantu kamu melakukan pemeriksaan awal risiko Tuberkulosis Paru dengan cepat, mudah dan terpercaya.</p>

            {/* Tombol */}
            <Link
              href="/konsultasi"
              className="inline-flex items-center gap-2 bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5 text-sm md:text-base lg:text-lg px-6 py-3 lg:px-8 lg:py-4"
            >
              Mulai Prediksi Sekarang
              <FiArrowRight className="text-base lg:text-lg shrink-0" />
            </Link>
          </div>

          {/* Kanan - Gambar Paru */}
          <div className="hidden md:flex flex-1 justify-center items-center relative">
            <div className="absolute w-64 h-64 lg:w-80 lg:h-80 bg-[#2F8F8B]/12 rounded-full blur-2xl pointer-events-none" />
            <Image src="/icon-paru.png" alt="Ilustrasi Paru-paru" width={0} height={0} sizes="100vw" className="relative w-full max-w-xs md:max-w-sm lg:max-w-xl object-contain drop-shadow-xl md:scale-190 lg:scale-200 mt-20" />
          </div>
        </div>
      </section>

      {/* SECTION KEUNGGULAN */}
      <section className="relative max-w-6xl mx-auto px-5 md:px-8 lg:px-6 mt-2 md:mt-4 mb-6 md:mb-8">
        <div className="w-full h-px bg-linear-to-r from-transparent via-gray-300 to-transparent mb-6 md:mb-10" />

        <div className="grid grid-cols-1 sm:grid-cols-3">
          {" "}
          {features.map((item, index, arr) => (
            <div key={index} className="relative flex items-center gap-3 md:gap-3 lg:gap-5 px-4 md:px-5 lg:px-10 py-5 md:py-6 lg:py-8">
              {/* Garis vertikal — sm ke atas */}
              {index !== arr.length - 1 && <div className="hidden sm:block absolute right-0 top-0 h-full w-px bg-linear-to-b from-transparent via-gray-300 to-transparent" />}
              {/* Garis horizontal — mobile saja */}
              {index !== arr.length - 1 && <div className="sm:hidden absolute bottom-0 left-4 right-4 h-px bg-gray-200" />}

              {/* Icon */}
              <div className="shrink-0 w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 flex items-center justify-center">
                <Image src={item.icon} alt={item.title} width={52} height={52} className="object-contain" />
              </div>

              {/* Teks */}
              <div className="min-w-0">
                <p className="font-bold text-gray-800 mb-0.5 md:mb-1 text-base md:text-sm lg:text-lg">{item.title}</p>
                <p className="text-gray-500 leading-relaxed text-sm md:text-xs lg:text-base">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION TENTANG APLIKASI TBCHECK */}
      <section id="tentang" className="py-10 md:py-14 bg-white rounded-tl-[3rem] md:rounded-tl-[5rem] rounded-tr-[3rem] md:rounded-tr-[5rem] scroll-mt-80 md:scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-6">
          {/* Judul */}
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-4xl font-bold text-gray-800 text-center mb-3">
              Apa itu <span className="text-[#2F8F8B]">TBCheck?</span>
            </h2>
            <div className="w-12 h-1 bg-[#2F8F8B] rounded mb-3 md:mb-4" />
            <p className="text-gray-500 text-sm md:text-lg text-center max-w-2xl">
              TBCheck adalah sistem pakar berbasis website untuk deteksi dini Tuberkulosis Paru. Sistem ini bukan sekadar AI biasa - dibangun di atas pengetahuan medis nyata dari dokter dan metode ilmiah yang terstruktur.
            </p>
          </div>

          {/* Tiga Kartu */}
          <div className="grid grid-cols-1 grid-rows-[auto_auto] md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Kartu 1 */}
            <div className="flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl px-10 py-10 shadow-sm hover:shadow-md hover:border-[#2F8F8B]/30 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-[#EAF6F6] flex items-center justify-center mb-5 shrink-0">
                <Image src="/stethoscope.png" alt="Sistem Pakar" width={56} height={56} className="object-contain" />
              </div>
              <p className="font-bold text-gray-800 text-base md:text-base lg:text-xl mb-3">Sistem Pakar dari Dokter Asli</p>
              <p className="text-gray-500 text-sm md:text-xs lg:text-base leading-relaxed text-justify">
                Basis pengetahuan disusun bersama dokter umum. 10 gejala klinis dan 12 aturan diagnosis telah divalidasi langsung oleh tenaga medis, bukan dibuat otomatis oleh AI.
              </p>
            </div>

            {/* Kartu 2 */}
            <div className="flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl px-10 py-10 shadow-sm hover:shadow-md hover:border-[#2F8F8B]/30 transition-all duration-300 cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-[#EAF6F6] flex items-center justify-center mb-5 shrink-0">
                <Image src="/gear.png" alt="Metode Ilmiah" width={56} height={56} className="object-contain" />
              </div>
              <p className="font-bold text-gray-800 text-base md:text-base lg:text-xl mb-3">Metode Ilmiah yang Terstruktur</p>
              <p className="text-gray-500 text-sm md:text-xs lg:text-base leading-relaxed text-justify">
                Diagnosis diproses melalui <span className="font-semibold text-gray-700">Forward Chaining</span> untuk menelusuri gejala secara logis dan <span className="font-semibold text-gray-700">Certainty Factor</span> untuk mengukur
                tingkat keyakinan diagnosis secara kuantitatif.
              </p>
            </div>

            {/* Kartu 3 */}
            <div className="flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl px-10 py-10 shadow-sm hover:shadow-md hover:border-[#2F8F8B]/30 transition-all duration-300 md:col-span-2 md:w-1/2 md:mx-auto lg:col-span-1 lg:w-auto lg:mx-0 cursor-pointer">
              <div className="w-20 h-20 rounded-full bg-[#EAF6F6] flex items-center justify-center mb-5 shrink-0">
                <Image src="/book.png" alt="Referensi Medis" width={56} height={56} className="object-contain" />
              </div>
              <p className="font-bold text-gray-800 text-base md:text-base lg:text-xl mb-3">Penjelasan Berbasis Referensi Medis</p>
              <p className="text-gray-500 text-sm md:text-xs lg:text-base leading-relaxed text-justify">
                Narasi hasil diagnosis bersumber dari dataset medis Alodokter yang terverifikasi melalui teknik <span className="font-semibold text-gray-700">Retrieval Augmented Generation (RAG)</span>, bukan hasil imajinasi AI semata.
              </p>
            </div>
          </div>

          {/* Catatan bawah */}
          <p className="text-center text-sm md:text-base text-gray-400 mt-3 md:mt-2">Sistem ini berfungsi sebagai alat bantu penilaian awal, bukan pengganti diagnosis medis resmi dari tenaga kesehatan.</p>
        </div>
      </section>

      {/* SECTION CARA KERJA */}
      <section className="py-10 md:py-14 bg-white  ">
        <div className="max-w-6xl mx-auto px-5 md:px-6">
          {/* Judul */}
          <h2 className="text-center text-2xl md:text-4xl font-bold text-gray-800 mb-3">Bagaimana TBCheck Bekerja?</h2>
          <div className="flex justify-center mb-8 md:mb-12">
            <div className="w-12 h-1 bg-[#2F8F8B] rounded" />
          </div>

          <div className="hidden lg:flex items-start justify-center gap-6">
            {steps.map((step, index, arr) => (
              <div key={index} className="flex items-start gap-6">
                <div className="flex flex-col items-center text-center w-72">
                  <div className="w-36 h-36 rounded-full bg-[#EAF6F6] flex items-center justify-center mb-6 shadow-sm">
                    <Image src={step.icon} alt={step.title} width={88} height={88} className="object-contain" />
                  </div>
                  <p className="font-bold text-gray-800 text-xl mb-2">{step.title}</p>
                  <p className="text-gray-500 text-lg leading-relaxed">{step.desc}</p>
                </div>
                {index !== arr.length - 1 && (
                  <div className="flex items-center mt-16">
                    <FaLongArrowAltRight className="text-4xl text-[#2F8F8B]/40 shrink-0" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile & Tablet: grid 2 */}
          <div className="grid grid-cols-2 lg:hidden gap-x-4 gap-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col">
                {/* Kartu langkah */}
                <div className="relative flex flex-col items-center text-center bg-white border border-gray-100 rounded-2xl px-3 py-5 shadow-sm w-full h-full">
                  {/* Badge nomor urut */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-[#2F8F8B] text-white flex items-center justify-center text-xs font-bold shadow-sm shadow-[#2F8F8B]/30"> {index + 1} </div>

                  {/* Icon */}
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-[#EAF6F6] flex items-center justify-center mb-3 shadow-sm mt-2 shrink-0">
                    <Image src={step.icon} alt={step.title} width={48} height={48} className="object-contain" />
                  </div>

                  {/* Teks */}
                  <p className="font-bold text-gray-800 text-sm md:text-base mb-1">{step.title}</p>
                  <p className="text-gray-400 text-xs md:text-sm leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION KENAPA DETEKSI DINI */}
      <section className="py-10 md:py-12 lg:py-14 bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-6">
          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-8 lg:gap-16">
            {/* Gambar: hidden di mobile, tampil di md ke atas */}
            <div className="hidden md:flex md:w-70 lg:flex-1 justify-center items-center relative shrink-0">
              <span className="absolute top-6 left-8 text-[#2F8F8B]/30 text-2xl font-bold pointer-events-none select-none">+</span>
              <span className="absolute top-16 right-12 text-[#2F8F8B]/20 text-xl font-bold pointer-events-none select-none">+</span>
              <span className="absolute bottom-10 left-16 text-[#2F8F8B]/20 text-xl font-bold pointer-events-none select-none">+</span>
              <Image src="/man.png" alt="Ilustrasi Deteksi Dini" width={0} height={0} sizes="100vw" className="relative w-full max-w-145 object-contain md:scale-180 lg:scale-150" />
            </div>

            {/* Kanan - Judul + Cards */}
            <div className="flex-1 flex flex-col w-full">
              {/* Judul */}
              <h2 className="font-bold text-gray-800 mb-3 text-2xl md:text-2xl lg:text-4xl">
                Kenapa <span className="text-[#2F8F8B]">Deteksi Dini</span> Itu Penting?
              </h2>
              <div className="w-16 h-1 bg-[#2F8F8B] rounded mb-5 md:mb-6 lg:mb-8" />

              {/* Cards */}
              <div className="flex flex-col gap-3">
                {cards.map((card, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 md:gap-4 lg:gap-5 bg-gray-50 border border-gray-100 rounded-2xl px-3 md:px-4 lg:px-5 py-3 md:py-3 lg:py-4 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#2F8F8B]/30 hover:bg-white hover:-translate-y-0.5 cursor-pointer"
                  >
                    {/* Icon */}
                    <div className="bg-[#EAF6F6] border border-gray-100 p-2 md:p-2 lg:p-3 rounded-full shrink-0">
                      <Image src={card.icon} alt={card.title} width={32} height={32} className="object-contain w-8 h-8 md:w-8 md:h-8 lg:w-11 lg:h-11" />
                    </div>

                    {/* Teks */}
                    <div>
                      <p className="font-bold text-gray-800 mb-0.5 text-base md:text-base lg:text-xl">{card.title}</p>
                      <p className="text-gray-500 leading-relaxed text-sm md:text-xs lg:text-base">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FAQ */}
      <section id="informasi-tbc" className="py-10 md:py-14 bg-white scroll-mt-80 md:scroll-mt-20">
        <div className="max-w-5xl mx-auto px-5 md:px-6">
          {/* Judul */}
          <div className="flex flex-col items-center mb-8 md:mb-12">
            <div className="flex items-center gap-2 md:gap-3 mb-3">
              <Image src="/question.png" alt="FAQ Icon" width={32} height={32} className="object-contain md:w-10 md:h-10" />
              <h2 className="text-xl md:text-4xl font-bold text-gray-800 text-center">
                Ada Pertanyaan Terkait <span className="text-[#2F8F8B]">TBC?</span>
              </h2>
            </div>
            <div className="w-12 h-1 bg-[#2F8F8B] rounded mb-3 md:mb-4" />
            <p className="text-gray-500 text-sm md:text-lg text-center">Temukan jawaban atas pertanyaan umum seputar TBC Paru dan penggunaan TBCheck.</p>
          </div>

          <FAQAccordion />
        </div>
      </section>

      {/* SECTION CTA */}
      <section className="pt-5 pb-14 md:pb-16 lg:pb-20 bg-white">
        <div className="max-w-6xl mx-auto px-5 md:px-8 lg:px-6">
          {/* TAMPILAN MOBILE */}
          <div className="md:hidden rounded-2xl overflow-hidden shadow-sm border border-[#2F8F8B]/15">
            {/* Bagian atas */}
            <div className="bg-linear-to-br from-[#EAF6F6] to-[#D4EEEE] px-6 py-6 flex flex-col items-center text-center">
              <p className="text-xs font-semibold text-[#2F8F8B] uppercase tracking-widest mb-2">Jangan Tunda Lagi</p>
              <p className="font-bold text-gray-800 text-lg leading-snug">
                Masih <span className="text-[#2F8F8B]">ragu</span> dengan kondisi kamu?
              </p>
            </div>

            {/* Bagian bawah */}
            <div className="bg-white px-6 py-5 flex flex-col items-center text-center gap-4">
              <p className="text-gray-500 text-sm leading-relaxed">Lakukan pemeriksaan sekarang dan ambil langkah terbaik untuk kesehatanmu.</p>
              <Link
                href="/konsultasi"
                className="inline-flex items-center justify-center gap-2
        bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-sm
        px-6 py-3 rounded-xl shadow-md shadow-[#2F8F8B]/25
        transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30"
              >
                Mulai Sekarang
                <FiArrowRight className="text-base" />
              </Link>
            </div>
          </div>

          {/* TAMPILAN TABLET */}
          <div className="hidden md:flex lg:hidden rounded-2xl overflow-hidden shadow-sm border border-[#2F8F8B]/15">
            <div className="bg-linear-to-br from-[#EAF6F6] to-[#D4EEEE] flex items-end gap-0 w-full">
              {/* Gambar dokter */}
              <div className="shrink-0 self-end pl-6">
                <Image src="/dokter.png" alt="Dokter TBCheck" width={0} height={0} sizes="100vw" className="w-50 object-contain scale-125" />
              </div>

              {/* Garis vertikal */}
              <div className="w-px self-stretch mx-5 my-6 bg-[#2F8F8B]/20 shrink-0" />

              {/* Teks + Tombol */}
              <div className="flex-1 py-6 pr-6 flex flex-col justify-center gap-3">
                <div>
                  <p className="font-bold text-gray-800 text-lg mb-1">
                    Masih <span className="text-[#2F8F8B]">ragu</span> dengan kondisi kamu?
                  </p>
                  <p className="text-gray-500 text-sm leading-relaxed">Lakukan pemeriksaan sekarang dan ambil langkah terbaik untuk kesehatanmu.</p>
                </div>
                <Link
                  href="/konsultasi"
                  className="self-start inline-flex items-center gap-2
              bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-sm
              px-5 py-2.5 rounded-xl shadow-md shadow-[#2F8F8B]/25
              transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30
              hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Mulai Sekarang
                  <FiArrowRight className="text-base" />
                </Link>
              </div>
            </div>
          </div>

          {/* TAMPILAN DESKTOP */}
          <div className="hidden lg:flex items-center justify-between gap-8 bg-linear-to-r from-[#EAF6F6] to-[#D4EEEE] border border-[#2F8F8B]/15 rounded-2xl px-8 shadow-sm overflow-hidden">
            <div className="shrink-0 flex items-end self-end">
              <Image src="/dokter.png" alt="Dokter TBCheck" width={0} height={0} sizes="100vw" className="w-50 object-contain scale-160" />
            </div>
            <div className="w-px h-25 bg-[#2F8F8B]/20 shrink-0" />
            <div className="flex-1 py-7">
              <p className="font-bold text-gray-800 text-xl mb-1">
                Masih <span className="text-[#2F8F8B]">ragu</span> dengan kondisi kamu?
              </p>
              <p className="text-gray-500 text-base leading-relaxed max-w-lg">TBC Paru bisa disembuhkan jika ditemukan sejak dini dan pengobatan yang tepat. Lakukan pemeriksaan sekarang dan ambil langkah terbaik untuk kesehatanmu.</p>
            </div>
            <Link
              href="/konsultasi"
              className="shrink-0 inline-flex items-center gap-2
          bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-base
          px-7 py-4 rounded-xl shadow-md shadow-[#2F8F8B]/25
          transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30
          hover:-translate-y-0.5 whitespace-nowrap"
            >
              Mulai Sekarang
              <FiArrowRight className="text-lg" />
            </Link>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
