"use client";

export default function AdminExportPage() {
  const handleDownload = () => {
    // Langsung arahkan browser ke endpoint, otomatis download
    window.location.href = "/api/export-excel";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-10 max-w-md w-full text-center">
        <h1 className="text-2xl font-extrabold text-gray-800 mb-2">Export Data Konsultasi</h1>
        <p className="text-gray-500 text-base mb-2">Download semua data hasil konsultasi TBC dalam format Excel</p>
        <button onClick={handleDownload} className="bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-base px-10 py-4 rounded-xl shadow-md transition-all duration-300 hover:-translate-y-0.5 cursor-pointer">
          Download Excel
        </button>
        <p className="text-gray-400 text-sm mt-6">Halaman ini hanya untuk keperluan admin dan tidak ditampilkan ke publik.</p>
      </div>
    </div>
  );
}
