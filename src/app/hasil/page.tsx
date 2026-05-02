"use client";

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
            <p className="text-3xl font-extrabold" style={{ color: warna }}>
              {isPositif ? "Terindikasi Tuberkulosis Paru" : "Tidak Terindikasi Tuberkulosis Paru"}
            </p>
            <p className="text-gray-500 text-base">
              Diagnosis berdasarkan <span className="font-bold text-gray-700">{jumlahGejala} gejala</span> yang Anda rasakan
            </p>
          </div>

          {/* Kanan - Circular Progress */}
          <div className="shrink-0">
            <svg width="160" height="160" viewBox="0 0 160 160">
              {/* Track abu-abu */}
              <circle cx="80" cy="80" r={radius} fill="none" stroke="#E5E7EB" strokeWidth="12" />
              {/* Progress berwarna */}
              <circle cx="80" cy="80" r={radius} fill="none" stroke={warna} strokeWidth="12" strokeDasharray={circumference} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 80 80)" />
              {/* Teks persentase */}
              <text x="80" y="70" textAnchor="middle" dominantBaseline="middle" fontSize="26" fontWeight="800" fill={warna}>
                {nilaiCF}%
              </text>
              {/* Teks "Tingkat" */}
              <text x="80" y="92" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#6B7280">
                Tingkat
              </text>
              {/* Teks "Kepastian" */}
              <text x="80" y="108" textAnchor="middle" dominantBaseline="middle" fontSize="13" fill="#6B7280">
                Kepastian
              </text>
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
