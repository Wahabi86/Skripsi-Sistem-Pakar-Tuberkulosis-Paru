"use client";
import React from "react";

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

interface PdfTemplateProps {
  hasil: HasilDiagnosis;
  narasi: string;
  id: string;
}

export default function PdfTemplate({ hasil, narasi, id }: PdfTemplateProps) {
  const isPositif = hasil.kode_penyakit === "P1";
  const isPerluPemeriksaan = hasil.kode_penyakit === "P3";

  const warna = isPositif ? "#DC2626" : isPerluPemeriksaan ? "#D97706" : "#2F8F8B";

  const statusBg = isPositif ? "#FEF2F2" : isPerluPemeriksaan ? "#FFFBEB" : "#F0FDFA";

  const statusBorder = isPositif ? "#FECACA" : isPerluPemeriksaan ? "#FDE68A" : "#99F6E4";

  return (
    <div id={id} style={{ padding: "36px 44px 60px 44px", backgroundColor: "white", width: "750px", color: "#333", fontFamily: "Arial, sans-serif" }}>
      {/* HEADER */}
      <div style={{ borderBottom: "2px solid #2F8F8B", paddingBottom: "12px", marginBottom: "24px" }}>
        {" "}
        <h1 style={{ color: "#2F8F8B", fontSize: "20px", margin: "0 0 6px 0", fontWeight: "bold", letterSpacing: "0.02em" }}>LAPORAN HASIL DIAGNOSIS TUBERKULOSIS PARU</h1>
        <p style={{ margin: "0 0 2px 0", fontSize: "12px", color: "#6B7280" }}>Sistem Pakar Diagnosis Dini Tuberkulosis Paru</p>
        <p style={{ margin: 0, fontSize: "12px", color: "#6B7280" }}>Tanggal Konsultasi: {hasil.tanggal}</p>
      </div>

      {/* HASIL DIAGNOSIS */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", borderBottom: "1px solid #E5E7EB", paddingBottom: "6px", color: "#111827", margin: "0 0 20px 0" }}>Hasil Diagnosis</h3>

        <div style={{ backgroundColor: statusBg, border: `1px solid ${statusBorder}`, borderRadius: "8px", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          {/* Kiri: label + nama penyakit + jumlah gejala */}
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "10px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px 0" }}>Status Diagnosis</p>
            <p style={{ fontSize: "20px", fontWeight: "800", color: warna, margin: "0 0 6px 0", lineHeight: 1.2 }}>{hasil.nama_penyakit}</p>
            <p style={{ fontSize: "12px", color: "#6B7280", margin: 0 }}>
              Berdasarkan <strong style={{ color: "#374151" }}>{hasil.jumlah_gejala} gejala</strong> yang terdeteksi
            </p>
          </div>

          {/* Kanan: Tingkat Kepastian - hanya tampil jika positif */}
          {isPositif && (
            <div style={{ minWidth: "110px", textAlign: "center", flexShrink: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: "600", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px 0" }}>Tingkat Kepastian</p>
              <p style={{ fontSize: "38px", fontWeight: "800", color: warna, margin: 0, lineHeight: 1 }}>{hasil.cf_akhir}%</p>
            </div>
          )}
        </div>
      </div>

      {/* GEJALA TERDETEKSI */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", borderBottom: "1px solid #E5E7EB", paddingBottom: "6px", color: "#111827", margin: "0 0 20px 0" }}>Gejala Terdeteksi</h3>

        {hasil.gejala_terdeteksi.length === 0 ? (
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Tidak ada gejala yang terdeteksi mengarah ke TBC.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
            <thead>
              <tr style={{ backgroundColor: "#F3F4F6" }}>
                <th style={{ padding: "10px 14px", textAlign: "center", fontWeight: "600", color: "#374151", width: "50px" }}>No</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "600", color: "#374151", width: "45%" }}>Nama Gejala</th>
                <th style={{ padding: "10px 14px", textAlign: "left", fontWeight: "600", color: "#374151" }}>Jawaban</th>
              </tr>
            </thead>
            <tbody>
              {hasil.gejala_terdeteksi.map((g, index) => (
                <tr key={g.kode_gejala} style={{ backgroundColor: index % 2 === 0 ? "#ffffff" : "#F9FAFB", borderBottom: "1px solid #F3F4F6" }}>
                  <td style={{ padding: "10px 14px", textAlign: "center", color: "#6B7280", fontWeight: "600", verticalAlign: "middle" }}>{index + 1}</td>
                  <td style={{ padding: "10px 14px", color: "#111827", lineHeight: "1.4", verticalAlign: "middle" }}>{g.nama_gejala}</td>
                  <td style={{ padding: "10px 14px", verticalAlign: "middle" }}>
                    <span style={{ color: "#DC2626", fontSize: "12px", fontWeight: "500", lineHeight: "1.5" }}>{g.jawaban}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ANALISIS & REKOMENDASI */}
      <div style={{ marginBottom: "24px" }}>
        <h3 style={{ fontSize: "14px", fontWeight: "bold", borderBottom: "1px solid #E5E7EB", paddingBottom: "6px", color: "#111827", margin: "0 0 14px 0" }}>Analisis & Rekomendasi Medis</h3>

        {narasi ? (
          narasi.split("\n\n").map((paragraf, i) => (
            <p key={i} style={{ fontSize: "13px", lineHeight: "1.7", color: "#374151", margin: "0 0 10px 0", textAlign: "justify" }}>
              {paragraf}
            </p>
          ))
        ) : (
          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>Analisis tidak tersedia.</p>
        )}

        <p style={{ fontSize: "11px", color: "#9CA3AF", textAlign: "center", marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #E5E7EB" }}>Dihasilkan oleh Gemini 2.5 Flash Berdasarkan Referensi RAG Alodokter</p>
      </div>

      {/* DISCLAIMER */}
      <p style={{ fontSize: "12px", color: "#111827", lineHeight: "1.8", margin: 0, padding: 0 }}>
        <strong>Catatan:</strong> Hasil ini merupakan penilaian awal berbasis gejala dan bukan pengganti diagnosis medis resmi. Pengguna tetap dianjurkan untuk melakukan pemeriksaan lebih lanjut ke fasilitas kesehatan.
      </p>
    </div>
  );
}
