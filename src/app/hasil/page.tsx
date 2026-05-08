"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Tipe Data
type GejalaTerdeteksi = {
  kode_gejala: string;
  nama_gejala: string;
  jawaban: string;
  nilai_cf_user: number;
};

type HasilDiagnosis = {
  id_konsultasi: number;
  kode_penyakit: string;
  nama_penyakit: string;
  cf_akhir: number;
  cf_detail: Record<string, number>;
  gejala_terdeteksi: GejalaTerdeteksi[];
  tanggal: string;
  jumlah_gejala: number;
};

export default function HasilPage() {
  const [narasi, setNarasi] = useState<string>("");
  const [loadingNarasi, setLoadingNarasi] = useState<boolean>(false);

  // State hasil diagnosis
  const [hasil] = useState<HasilDiagnosis | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("hasilDiagnosis");
    if (!raw) return null;
    return JSON.parse(raw);
  });

  // useRef sebagai penjaga agar fetchNarasi hanya dipanggil sekali
  const hasFetched = useRef(false);

  // Fetch narasi dari RAG-LLM
  useEffect(() => {
    // Jika sudah pernah fetch atau tidak ada data, hentikan
    if (!hasil || hasFetched.current) return;

    // Tandai sudah pernah fetch
    hasFetched.current = true;

    const fetchNarasi = async () => {
      setLoadingNarasi(true);
      try {
        const response = await fetch("/api/narasi", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_konsultasi: hasil.id_konsultasi,
            status_diagnosis: hasil.nama_penyakit,
            cf_akhir: hasil.cf_akhir,
            gejala_terdeteksi: hasil.gejala_terdeteksi,
          }),
        });
        const data = await response.json();
        if (data.success) {
          setNarasi(data.narasi);
        }
      } catch (err) {
        console.error("Gagal mengambil narasi:", err);
      } finally {
        setLoadingNarasi(false);
      }
    };

    fetchNarasi();
  }, [hasil]);

  // Tampilan loading saat data belum siap
  if (!hasil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Memuat hasil diagnosis...</p>
      </div>
    );
  }

  // Kalkulasi tampilan dari data nyata
  const isPositif = hasil.kode_penyakit === "P1";
  const isPerluPemeriksaan = hasil.kode_penyakit === "P3";
  const warna = isPositif ? "#DC2626" : isPerluPemeriksaan ? "#FCD34D" : "#2F8F8B";

  // Warna background + border section status diagnosis
  const bgStatus = isPositif ? "bg-red-50 border-red-200" : isPerluPemeriksaan ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200";

  // Kalkulasi SVG circular progress
  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (hasil.cf_akhir / 100) * circumference;

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        {/* Judul */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Hasil Diagnosis <span className="text-[#2F8F8B]">Tuberkulosis Paru</span>
          </h1>
          <p className="text-gray-500 text-base">Tanggal Konsultasi: {hasil.tanggal}</p>
        </div>

        {/* Section Status Diagnosis */}
        <div className={`flex items-center justify-between gap-6 rounded-2xl border shadow-sm px-8 py-6 mb-6 ${bgStatus}`}>
          {/* Kiri - Teks */}
          <div className="flex flex-col gap-3">
            <p className="text-gray-500 text-xl font-semibold uppercase tracking-widest">Status Diagnosis</p>
            <p className="text-2xl font-extrabold" style={{ color: warna }}>
              {hasil.nama_penyakit}
            </p>
            {isPositif && <p className="text-gray-600 text-base leading-relaxed max-w-xl">Disarankan untuk melakukan pemeriksaan lebih lanjut ke fasilitas kesehatan.</p>}
            {isPerluPemeriksaan && (
              <p className="text-gray-600 text-base leading-relaxed">Gejala yang Anda alami belum cukup untuk menentukan diagnosis TBC Paru. Disarankan untuk melakukan pemeriksaan lebih lanjut ke fasilitas kesehatan.</p>
            )}
            <p className="text-gray-500 text-base">
              Diagnosis berdasarkan <span className="font-bold text-gray-700">{hasil.jumlah_gejala} gejala</span> yang Anda rasakan
            </p>
          </div>

          {/* Kanan - Circular Progress */}
          {isPositif && (
            <div className="shrink-0">
              <svg width="160" height="160" viewBox="0 0 160 160">
                <circle cx="80" cy="80" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
                <circle cx="80" cy="80" r={radius} fill="none" stroke={warna} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 80 80)" />
                <text x="80" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill={warna}>
                  {hasil.cf_akhir}%
                </text>
                <text x="80" y="92" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#6B7280">
                  Tingkat
                </text>
                <text x="80" y="108" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#6B7280">
                  Kepastian
                </text>
              </svg>
            </div>
          )}
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
              {hasil.gejala_terdeteksi.length === 0 ? (
                <p className="text-gray-400 text-base">Tidak ada gejala yang terdeteksi mengarah ke TBC.</p>
              ) : (
                hasil.gejala_terdeteksi.map((g) => (
                  <div key={g.kode_gejala} className="flex items-center justify-between gap-4 bg-white border border-gray-100 rounded-xl px-4 py-3">
                    {/* Kiri - nama gejala dari database */}
                    <p className="text-gray-800 text-base font-medium">{g.nama_gejala}</p>
                    {/* Kanan - jawaban user */}
                    <div className="shrink-0 flex items-center bg-red-50 border border-red-200 text-red-600 text-sm font-medium px-4 py-2 rounded-xl">
                      <span>{g.jawaban}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Section Analisis & Rekomendasi MASIH DUMMY DAN PERLU INTEGRASI DENGAN RAG-LLM NANTI*/}
          <div className="rounded-2xl border border-gray-100 shadow-sm bg-gray-50 px-6 py-5">
            {/* Judul */}
            <div className="flex items-center gap-3 mb-4">
              <Image src="/shield1.png" alt="Analisis & Rekomendasi Medis" width={32} height={32} className="object-contain" />
              <p className="text-gray-800 text-lg font-bold">Analisis & Rekomendasi Medis</p>
            </div>

            {/* Teks Analisis */}
            <div className="flex flex-col gap-4">
              {loadingNarasi ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-5 h-5 border-2 border-[#2F8F8B] border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-base">Sedang menganalisis hasil diagnosis...</p>
                </div>
              ) : narasi ? (
                narasi.split("\n\n").map((paragraf, i) => (
                  <p key={i} className="text-gray-600 text-base leading-relaxed">
                    {paragraf}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 text-base">Analisis tidak tersedia, coba beberapa saat lagi...</p>
              )}
            </div>

            {/* Sumber */}
            <div className="mx-8 mt-4 border-t border-gray-200 mb-4" />
            <p className="text-center text-gray-400 text-sm">{loadingNarasi ? "Memproses..." : "Dihasilkan oleh Gemini 2.5 Flash Berdasarkan Referensi RAG Alodokter"}</p>
          </div>

          {/* Section Disclaimer */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-6 py-5 ">
            <p className="text-yellow-800 text-base leading-relaxed">
              <span className="font-bold">Catatan:</span> Hasil ini merupakan penilaian awal berbasis gejala dan bukan pengganti diagnosis medis resmi. Pengguna tetap dianjurkan untuk melakukan pemeriksaan lebih lanjut ke fasilitas
              kesehatan.
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
