"use client";

import Image from "next/image";
import Link from "next/link";

// Mapping kode gejala ke nama gejala
const namaGejala: Record<string, string> = {
  G1: "Batuk lebih dari 2 minggu",
  G2: "Batuk berdahak",
  G3: "Batuk berdarah",
  G4: "Terasa nyeri di bagian dada",
  G5: "Sesak napas",
  G6: "Malaise (Lelah atau lemas)",
  G7: "Penurunan berat badan",
  G8: "Nafsu makan menurun",
  G9: "Demam",
  G10: "Berkeringat di malam hari",
};

// Data dummy gejala yang terindikasi (jawaban mengarah ke TBC)
const gejalaTerdeteksi = [
  { kode: "G1", jawaban: "Sudah lebih dari 2 minggu dan masih berlanjut" },
  { kode: "G2", jawaban: "Kadang-kadang ada dahak, tidak setiap batuk" },
  { kode: "G3", jawaban: "Ya, sudah beberapa kali terjadi" },
  { kode: "G4", jawaban: "Ya, nyeri muncul terutama saat batuk atau bernapas dalam" },
  { kode: "G6", jawaban: "Ya, sering merasa lemas meski tidak banyak beraktivitas" },
  { kode: "G7", jawaban: "Ya, berat badan turun cukup signifikan belakangan ini" },
  { kode: "G9", jawaban: "Ya, demam ringan yang hilang timbul" },
  { kode: "G10", jawaban: "Ya, beberapa kali dalam seminggu" },
];

// Teks analisis dummy
const analisisDummy = `Berdasarkan gejala yang Anda laporkan, terdapat kombinasi gejala khas yang sangat erat kaitannya dengan infeksi Tuberkulosis Paru, terutama batuk persisten lebih dari dua minggu disertai dahak dan batuk berdarah.

Gejala sistemik seperti demam ringan yang hilang timbul, keringat malam berlebih, dan penurunan berat badan tanpa sebab jelas merupakan tanda klasik infeksi TBC aktif yang memerlukan perhatian segera dari tenaga kesehatan.

Sangat dianjurkan untuk segera mengunjungi Puskesmas atau rumah sakit terdekat guna menjalani pemeriksaan lanjutan seperti tes dahak (sputum BTA), foto rontgen dada, dan tes TCM (Tes Cepat Molekuler) untuk konfirmasi diagnosis secara resmi.`;

export default function HasilPage() {
  const tanggal = "02/05/2026";

  // Data dummy
  const status = "terindikasi";
  const nilaiCF = 82;
  const jumlahGejala = 8;

  const isPositif = status === "terindikasi";
  const warna = isPositif ? "#DC2626" : "#2F8F8B";

  // Kalkulasi SVG circular progress
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (nilaiCF / 100) * circumference;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        {/* Judul */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Hasil Diagnosis <span className="text-[#2F8F8B]">Tuberkulosis Paru</span>
          </h1>
          <p className="text-gray-500 text-base">Tanggal Konsultasi: {tanggal}</p>
        </div>

        {/* Section Status Diagnosis */}
        <div className="flex items-center justify-between gap-6 rounded-2xl border border-gray-100 shadow-sm bg-gray-50 px-8 py-6 mb-6">
          {/* Kiri - Teks */}
          <div className="flex flex-col gap-3">
            <p className="text-gray-500 text-xl font-semibold uppercase tracking-widest">Status Diagnosis</p>
            <p className="text-2xl font-extrabold" style={{ color: warna }}>
              {isPositif ? "Terindikasi Tuberkulosis Paru" : "Tidak Terindikasi Tuberkulosis Paru"}
            </p>
            <p className="text-gray-500 text-base">
              Diagnosis berdasarkan <span className="font-bold text-gray-700">{jumlahGejala} gejala</span> yang Anda rasakan
            </p>
          </div>

          {/* Kanan - Circular Progress */}
          <div className="shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle cx="80" cy="80" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle cx="80" cy="80" r={radius} fill="none" stroke={warna} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 80 80)" />
              <text x="80" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill={warna}>
                {nilaiCF}%
              </text>
              <text x="80" y="92" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#6B7280">
                Tingkat
              </text>
              <text x="80" y="108" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#6B7280">
                Kepastian
              </text>
            </svg>
          </div>
        </div>

        {/* Section Gejala */}
        <div className="flex flex-col gap-6">
          {/* Kiri - Gejala Terdeteksi */}
          <div className="rounded-2xl border border-gray-100 shadow-sm bg-gray-50 px-6 py-5">
            {/* Judul */}
            <div className="flex items-center gap-2 mb-4">
              <Image src="/checklist.png" alt="Gejala Terdeteksi" width={32} height={32} className="object-contain" />
              <p className="text-gray-800 text-lg font-bold">Gejala Terdeteksi</p>
            </div>

            {/* Daftar Gejala */}
            <div className="flex flex-col gap-2">
              {gejalaTerdeteksi.map((g) => (
                <div key={g.kode} className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3">
                  {/* Kiri - nama gejala */}
                  <p className="text-gray-800 text-base font-medium">{namaGejala[g.kode]}</p>

                  {/* Kanan - jawaban style konsultasi */}
                  <div className="shrink-0 flex items-center gap-2 bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-xl">
                    <span>⚠</span>
                    <span>{g.jawaban}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section Analisis & Rekomendasi */}
          <div className="rounded-2xl border border-gray-100 shadow-sm bg-gray-50 px-6 py-5">
            {/* Judul */}
            <div className="flex items-center gap-3 mb-4">
              <Image src="/shield1.png" alt="Analisis & Rekomendasi Medis" width={32} height={32} className="object-contain" />
              <p className="text-gray-800 text-lg font-bold">Analisis & Rekomendasi Medis</p>
            </div>

            {/* Teks Analisis */}
            <div className="flex flex-col gap-4">
              {analisisDummy.split("\n\n").map((paragraf, i) => (
                <p key={i} className="text-gray-600 text-base leading-relaxed">
                  {paragraf}
                </p>
              ))}
            </div>

            {/* Sumber */}
            <div className="mx-8 mt-4 border-t border-gray-200 mb-4" />
            <p className="text-center text-gray-400 text-sm">Dihasilkan oleh Gemini 2.5 Flash via RAG Alodokter</p>
          </div>

          {/* Section Disclaimer */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-6 py-5 ">
            <p className="text-yellow-800 text-base leading-relaxed">
              <span className="font-bold">Catatan:</span> Hasil ini merupakan penilaian awal berbasis gejala dan bukan pengganti diagnosis medis resmi. Pengguna tetap dianjurkan untuk melakukan pemeriksaan lebih lanjut ke tenaga kesehatan.
            </p>
          </div>
        </div>

        {/* Section Aksi */}
        <div className="flex items-center justify-center gap-4 py-2 mt-4">
          {/* Tombol Konsultasi Ulang */}
          <Link
            href="/konsultasi"
            className="inline-flex items-center gap-2 border border-gray-300 hover:border-[#2F8F8B] bg-white hover:bg-[#EAF6F6] text-gray-700 hover:text-[#2F8F8B] font-semibold text-base px-8 py-4 rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Konsultasi Ulang
          </Link>

          {/* Tombol Cetak Hasil */}
          <button className="inline-flex items-center gap-2 bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-base px-8 py-4 rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5 cursor-pointer">
            Cetak Hasil (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
