"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

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

  const [hasil] = useState<HasilDiagnosis | null>(() => {
    if (typeof window === "undefined") return null;
    const raw = sessionStorage.getItem("hasilDiagnosis");
    if (!raw) return null;
    return JSON.parse(raw);
  });

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasil || hasFetched.current) return;
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
        if (data.success) setNarasi(data.narasi);
      } catch (err) {
        console.error("Gagal mengambil narasi:", err);
      } finally {
        setLoadingNarasi(false);
      }
    };

    fetchNarasi();
  }, [hasil]);

  if (!hasil) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Memuat hasil diagnosis...</p>
      </div>
    );
  }

  const isPositif = hasil.kode_penyakit === "P1";
  const isPerluPemeriksaan = hasil.kode_penyakit === "P3";
  const warna = isPositif ? "#DC2626" : isPerluPemeriksaan ? "#F59E0B" : "#2F8F8B";
  const bgStatus = isPositif ? "bg-red-50 border-red-200" : isPerluPemeriksaan ? "bg-yellow-50 border-yellow-200" : "bg-green-50 border-green-200";

  const radius = 58;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (hasil.cf_akhir / 100) * circumference;

  return (
    <div className="min-h-screen py-6 md:py-10 px-4">
      <div
        className="max-w-6xl mx-auto bg-white rounded-2xl
        p-5 md:p-8
        shadow-xl border border-gray-100"
      >
        {/* JUDUL */}
        <div className="text-center mb-6 md:mb-8">
          <h1
            className="font-extrabold text-gray-800 mb-2
            text-xl md:text-3xl"
          >
            Hasil Diagnosis <span className="text-[#2F8F8B]">Tuberkulosis Paru</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">Tanggal Konsultasi: {hasil.tanggal}</p>
        </div>

        {/* STATUS DIAGNOSIS */}
        <div className={`rounded-2xl border shadow-sm px-5 md:px-8 py-5 md:py-6 mb-6 ${bgStatus}`}>
          {/* MOBILE */}
          <div className="flex md:hidden flex-col gap-4 items-center text-center">
            {/* 1. Label + Nama Penyakit */}
            <div className="flex flex-col gap-2 items-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">Status Diagnosis</p>
              <p className="text-xl font-extrabold leading-snug" style={{ color: warna }}>
                {hasil.nama_penyakit}
              </p>
            </div>

            {/* 2. Circular Progress */}
            {isPositif && (
              <div className="flex justify-center">
                <svg width="120" height="120" viewBox="0 0 160 160">
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

            {/* 3. Teks keterangan + jumlah gejala */}
            <div className="flex flex-col gap-2 items-center">
              {isPositif && <p className="text-gray-600 text-sm leading-relaxed">Disarankan untuk melakukan pemeriksaan lebih lanjut ke fasilitas kesehatan.</p>}
              {isPerluPemeriksaan && <p className="text-gray-600 text-sm leading-relaxed">Gejala yang Anda alami belum cukup untuk menentukan diagnosis TBC Paru. Disarankan untuk melakukan pemeriksaan lebih lanjut.</p>}
              <p className="text-gray-500 text-sm">
                Diagnosis berdasarkan <span className="font-bold text-gray-700">{hasil.jumlah_gejala} gejala</span> yang Anda rasakan
              </p>
            </div>
          </div>

          {/* DESKTOP */}
          <div className="hidden md:flex items-center justify-between gap-6">
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
        </div>

        {/* SECTION GEJALA + ANALISIS */}
        <div className="flex flex-col gap-4 md:gap-6">
          {/* Gejala Terdeteksi */}
          <div className="rounded-2xl border border-gray-100 shadow-sm bg-gray-50 px-4 md:px-6 py-4 md:py-5">
            <div className="flex items-center gap-2 mb-3 md:mb-4">
              <Image src="/checklist.png" alt="Gejala Terdeteksi" width={28} height={28} className="object-contain md:w-8 md:h-8" />
              <p className="text-gray-800 text-base md:text-lg font-bold">Gejala Terdeteksi</p>
            </div>

            <div className="flex flex-col gap-2">
              {hasil.gejala_terdeteksi.length === 0 ? (
                <p className="text-gray-400 text-sm md:text-base">Tidak ada gejala yang terdeteksi mengarah ke TBC.</p>
              ) : (
                hasil.gejala_terdeteksi.map((g) => (
                  <div
                    key={g.kode_gejala}
                    className="bg-white border border-gray-100 rounded-xl px-3 md:px-4 py-2.5 md:py-3
                      flex flex-col md:flex-row md:items-center md:justify-between gap-1.5 md:gap-4"
                  >
                    {/* Nama gejala */}
                    <p className="text-gray-800 text-sm md:text-base font-medium">{g.nama_gejala}</p>
                    {/* Jawaban*/}
                    <div className="flex items-center bg-red-50 border border-red-200 text-red-600 text-xs md:text-sm font-medium px-3 py-1.5 md:px-4 md:py-2 rounded-xl md:shrink-0 w-fit">{g.jawaban}</div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Analisis & Rekomendasi */}
          <div className="rounded-2xl border border-gray-100 shadow-sm bg-gray-50 px-4 md:px-6 py-4 md:py-5">
            <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-4">
              <Image src="/shield1.png" alt="Analisis" width={28} height={28} className="object-contain md:w-8 md:h-8" />
              <p className="text-gray-800 text-base md:text-lg font-bold">Analisis & Rekomendasi Medis</p>
            </div>

            <div className="flex flex-col gap-3 md:gap-4">
              {loadingNarasi ? (
                <div className="flex items-center gap-3 py-3 md:py-4">
                  <div className="w-4 h-4 md:w-5 md:h-5 border-2 border-[#2F8F8B] border-t-transparent rounded-full animate-spin" />
                  <p className="text-gray-400 text-sm md:text-base">Sedang menganalisis hasil diagnosis...</p>
                </div>
              ) : narasi ? (
                narasi.split("\n\n").map((paragraf, i) => (
                  <p key={i} className="text-gray-600 text-sm md:text-base leading-relaxed">
                    {paragraf}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 text-sm md:text-base">Analisis tidak tersedia, coba beberapa saat lagi...</p>
              )}
            </div>

            <div className="mx-4 md:mx-8 mt-4 border-t border-gray-200 mb-3 md:mb-4" />
            <p className="text-center text-gray-400 text-xs md:text-sm">{loadingNarasi ? "Memproses..." : "Dihasilkan oleh Gemini 2.5 Flash Berdasarkan Referensi RAG Alodokter"}</p>
          </div>

          {/* Disclaimer */}
          <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 md:px-6 py-4 md:py-5">
            <p className="text-yellow-800 text-sm md:text-base leading-relaxed">
              <span className="font-bold">Catatan:</span> Hasil ini merupakan penilaian awal berbasis gejala dan bukan pengganti diagnosis medis resmi. Pengguna tetap dianjurkan untuk melakukan pemeriksaan lebih lanjut ke fasilitas
              kesehatan.
            </p>
          </div>
        </div>

        {/* TOMBOL */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 md:gap-4 mt-6 md:mt-4">
          <Link
            href="/konsultasi"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
              border border-gray-300 hover:border-[#2F8F8B]
              bg-white hover:bg-[#EAF6F6]
              text-gray-700 hover:text-[#2F8F8B]
              font-semibold
              text-sm md:text-base
              px-6 py-3 md:px-8 md:py-4
              rounded-xl transition-all duration-300 hover:-translate-y-0.5"
          >
            Konsultasi Ulang
          </Link>
          <button
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2
              bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold
              text-sm md:text-base
              px-6 py-3 md:px-8 md:py-4
              rounded-xl shadow-md shadow-[#2F8F8B]/25
              transition-all duration-300
              hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5 cursor-pointer"
          >
            Cetak Hasil (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
