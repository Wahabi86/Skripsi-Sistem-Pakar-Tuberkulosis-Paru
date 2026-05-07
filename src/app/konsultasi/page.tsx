"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import axiosInstance from "@/lib/axios";

// Tipe Data
type Pilihan = {
  id_pilihan: number;
  teks_pilihan: string;
  nilai_cf_user: number;
  urutan: number;
};

type Gejala = {
  kode_gejala: string;
  nama_gejala: string;
  pertanyaan: string;
  cf_pakar: number;
  tb_pilihan: Pilihan[];
};

// Komponen Dropdown Custom
function CustomDropdown({ options, value, onChange, placeholder = "Pilih jawaban" }: { options: { label: string }[]; value: string; onChange: (val: string) => void; placeholder?: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-80 shrink-0">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-base transition-all duration-200
          ${open ? "border-[#2F8F8B] shadow-sm shadow-[#2F8F8B]/10" : "border-gray-200 hover:border-[#2F8F8B]/50"}
          ${value ? "text-gray-800" : "text-gray-400"} bg-white`}
      >
        <span className="truncate">{value || placeholder}</span>
        <IoIosArrowDown className={`shrink-0 text-[#2F8F8B] transition-transform duration-300 ${open ? "rotate-180" : "rotate-0"}`} />
      </button>

      {/* Dropdown List */}
      <div
        className={`absolute z-50 w-full mt-2 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden transition-all duration-300
          ${open ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"}`}
      >
        {options.map((opt) => (
          <button
            key={opt.label}
            type="button"
            onClick={() => {
              onChange(opt.label);
              setOpen(false);
            }}
            className={`w-full text-left px-4 py-3 text-base transition-colors duration-150
              ${value === opt.label ? "bg-[#EAF6F6] text-[#2F8F8B] font-medium" : "text-gray-700 hover:bg-gray-50"}`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function KonsultasiPage() {
  const router = useRouter();

  // State data gejala dari database
  const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
  // State loading saat data gejala sedang diambil
  const [loading, setLoading] = useState(true);
  // State loading saat tombol diagnosis diklik
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  // State jawaban user
  const [answers, setAnswers] = useState<Record<string, string>>({});
  // State untuk menyimpan id_pilihan yang dipilih
  const [selectedIds, setSelectedIds] = useState<Record<string, number>>({});

  // Fetch data gejala + pilihan jawaban
  useEffect(() => {
    async function fetchGejala() {
      try {
        const res = await axiosInstance.get("/api/gejala");
        if (res.data.success) {
          setGejalaList(res.data.data);
        }
      } catch (err) {
        console.error("Gagal fetch gejala:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGejala();
  }, []);

  // Hitung progress jawaban
  const answered = Object.values(answers).filter((v) => v !== "").length;
  const total = gejalaList.length;
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  // Simpan teks jawaban + id_pilihan
  const handleSelect = (kodeGejala: string, teksPilihan: string, idPilihan: number) => {
    setAnswers((prev) => ({ ...prev, [kodeGejala]: teksPilihan }));
    setSelectedIds((prev) => ({ ...prev, [kodeGejala]: idPilihan }));
  };

  // Kirim jawaban ke API diagnosis lalu redirect ke halaman hasil
  const handleDiagnosis = async () => {
    setLoadingDiagnosis(true);
    try {
      const res = await axiosInstance.post("/api/diagnosis", {
        jawaban: selectedIds,
      });
      if (res.data.success) {
        // Simpan hasil ke sessionStorage agar bisa dibaca di halaman /hasil
        sessionStorage.setItem("hasilDiagnosis", JSON.stringify(res.data.data));
        router.push("/hasil");
      }
    } catch (err) {
      console.error("Gagal diagnosis:", err);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  // Tampilan loading saat data gejala belum siap
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Memuat pertanyaan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        {/* Judul */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
            Form Konsultasi Gejala <span className="text-[#2F8F8B]">Tuberkulosis Paru</span>
          </h1>
          <p className="text-gray-500 text-base">Jawab pertanyaan berikut sesuai kondisi yang Anda rasakan</p>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-8">
          <div className="flex justify-between text-base text-gray-600 mb-2">
            <span>
              Pertanyaan Terisi <span className="font-bold text-[#2F8F8B]">{answered}</span> dari <span className="font-bold text-[#2F8F8B]">{total}</span> Gejala
            </span>
            <span className="font-bold text-[#2F8F8B]">{percentage}%</span>
          </div>

          {/* Bar */}
          <div className="w-full bg-gray-300 rounded-full h-3 mb-3">
            <div className="bg-[#2F8F8B] h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>

          {/* Indikator per soal */}
          <div className="flex gap-2 flex-wrap">
            {gejalaList.map((g) => (
              <div key={g.kode_gejala} className={`h-2 flex-1 rounded-full transition-all duration-300 ${answers[g.kode_gejala] ? "bg-[#2F8F8B]" : "bg-gray-300"}`} />
            ))}
          </div>
        </div>

        {/* Daftar Pertanyaan */}
        <div className="flex flex-col gap-4 mb-8">
          {gejalaList.map((g, index) => {
            const selectedLabel = answers[g.kode_gejala] ?? null;

            // format pilihan dari tb_pilihan (database)
            const options = g.tb_pilihan.map((p) => ({ label: p.teks_pilihan }));

            return (
              <div
                key={g.kode_gejala}
                className={`border rounded-2xl overflow-visible transition-all duration-300 bg-white
    ${answered ? "border-[#2F8F8B]/30 shadow-md shadow-[#2F8F8B]/10" : "border-gray-100 shadow-sm"}`}
              >
                {/* Header pertanyaan */}
                <div className="flex items-center justify-between gap-4 px-6 py-5">
                  <div className="flex items-center gap-4 flex-1">
                    {/* Nomor */}
                    <span
                      className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors duration-300
                      ${answered ? "bg-[#2F8F8B] text-white" : "bg-[#EAF6F6] text-[#2F8F8B]"}`}
                    >
                      {index + 1}
                    </span>
                    {/* Pertanyaan */}
                    <p className="text-gray-800 text-base font-medium">{g.pertanyaan}</p>
                  </div>

                  {/* Dropdown */}
                  <CustomDropdown
                    options={options}
                    value={answers[g.kode_gejala] ?? ""}
                    onChange={(val) => {
                      const pilihan = g.tb_pilihan.find((p) => p.teks_pilihan === val);
                      if (pilihan) {
                        handleSelect(g.kode_gejala, val, pilihan.id_pilihan);
                      }
                    }}
                  />
                </div>

                {/* Jawaban terpilih */}
                {selectedLabel && (
                  <div className="mx-6 mb-4 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium bg-[#EAF6F6] border border-[#2F8F8B]/20 text-[#2F8F8B]">
                    <span>✓</span>
                    <span>{selectedLabel}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tombol */}
        <div className="flex justify-center">
          <button
            onClick={handleDiagnosis}
            disabled={answered < total || loadingDiagnosis}
            className="bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-lg px-12 py-4 rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
          >
            {/* DIUPDATE: teks tombol berubah saat loading */}
            {loadingDiagnosis ? "Memproses..." : "Mulai Diagnosis"}
          </button>
        </div>
      </div>
    </div>
  );
}
