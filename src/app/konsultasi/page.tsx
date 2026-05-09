"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { IoIosArrowDown } from "react-icons/io";
import axiosInstance from "@/lib/axios";

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
    <div ref={ref} className="relative w-full">
      {/* Trigger */}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border text-left text-sm md:text-base transition-all duration-200
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
            className={`w-full text-left px-4 py-3 text-sm md:text-base transition-colors duration-150
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
  const [gejalaList, setGejalaList] = useState<Gejala[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDiagnosis, setLoadingDiagnosis] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedIds, setSelectedIds] = useState<Record<string, number>>({});

  useEffect(() => {
    async function fetchGejala() {
      try {
        const res = await axiosInstance.get("/api/gejala");
        if (res.data.success) setGejalaList(res.data.data);
      } catch (err) {
        console.error("Gagal fetch gejala:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchGejala();
  }, []);

  const answered = Object.values(answers).filter((v) => v !== "").length;
  const total = gejalaList.length;
  const percentage = total > 0 ? Math.round((answered / total) * 100) : 0;

  const handleSelect = (kodeGejala: string, teksPilihan: string, idPilihan: number) => {
    setAnswers((prev) => ({ ...prev, [kodeGejala]: teksPilihan }));
    setSelectedIds((prev) => ({ ...prev, [kodeGejala]: idPilihan }));
  };

  const handleDiagnosis = async () => {
    setLoadingDiagnosis(true);
    try {
      const res = await axiosInstance.post("/api/diagnosis", { jawaban: selectedIds });
      if (res.data.success) {
        sessionStorage.setItem("hasilDiagnosis", JSON.stringify(res.data.data));
        router.push("/hasil");
      }
    } catch (err) {
      console.error("Gagal diagnosis:", err);
    } finally {
      setLoadingDiagnosis(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">Memuat pertanyaan...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 md:py-10 px-4 mb-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-5 md:p-8 shadow-xl border border-gray-100">
        {/* JUDUL */}
        <div className="text-center mb-6 md:mb-8">
          <h1
            className="font-extrabold text-gray-800 mb-2
            text-xl md:text-3xl"
          >
            Form Konsultasi Gejala <span className="text-[#2F8F8B]">Tuberkulosis Paru</span>
          </h1>
          <p className="text-gray-500 text-sm md:text-base">Jawab pertanyaan berikut sesuai kondisi yang Anda rasakan</p>
        </div>

        {/* PROGRESS BAR */}
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 md:p-5 mb-6 md:mb-8">
          {/* Info teks — mobile: 2 baris, desktop: 1 baris */}
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs md:text-base text-gray-600">
              Terisi <span className="font-bold text-[#2F8F8B]">{answered}</span> / <span className="font-bold text-[#2F8F8B]">{total}</span>
              <span className="hidden md:inline"> Gejala</span>
            </p>
            <span className="font-bold text-[#2F8F8B] text-sm md:text-base">{percentage}%</span>
          </div>

          {/* Bar utama */}
          <div className="w-full bg-gray-300 rounded-full h-2 md:h-3 mb-2 md:mb-3">
            <div className="bg-[#2F8F8B] h-2 md:h-3 rounded-full transition-all duration-500" style={{ width: `${percentage}%` }} />
          </div>

          {/* Indikator per soal — lebih kecil di mobile */}
          <div className="flex gap-1 md:gap-2 flex-wrap">
            {gejalaList.map((g) => (
              <div key={g.kode_gejala} className={`h-1.5 md:h-2 flex-1 rounded-full transition-all duration-300 ${answers[g.kode_gejala] ? "bg-[#2F8F8B]" : "bg-gray-300"}`} />
            ))}
          </div>
        </div>

        {/* DAFTAR PERTANYAAN*/}
        <div className="flex flex-col gap-3 md:gap-4 mb-6 md:mb-8">
          {gejalaList.map((g, index) => {
            const selectedLabel = answers[g.kode_gejala] ?? null;
            const options = g.tb_pilihan.map((p) => ({ label: p.teks_pilihan }));
            const isAnswered = !!answers[g.kode_gejala];

            return (
              <div
                key={g.kode_gejala}
                className={`border rounded-2xl overflow-visible transition-all duration-300 bg-white
                  ${isAnswered ? "border-[#2F8F8B]/30 shadow-md shadow-[#2F8F8B]/10" : "border-gray-100 shadow-sm"}`}
              >
                <div className="px-4 md:px-6 py-4 md:py-5">
                  {/* MOBILE*/}
                  <div className="flex md:hidden flex-col gap-3">
                    {/* Baris atas: nomor + pertanyaan */}
                    <div className="flex items-start gap-3">
                      <span
                        className={`shrink-0 w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold
                        ${isAnswered ? "bg-[#2F8F8B] text-white" : "bg-[#EAF6F6] text-[#2F8F8B]"}`}
                      >
                        {index + 1}
                      </span>
                      <p className="text-gray-800 text-sm font-medium leading-snug pt-0.5">{g.pertanyaan}</p>
                    </div>

                    {/* Dropdown full width di bawah */}
                    <CustomDropdown
                      options={options}
                      value={answers[g.kode_gejala] ?? ""}
                      onChange={(val) => {
                        const pilihan = g.tb_pilihan.find((p) => p.teks_pilihan === val);
                        if (pilihan) handleSelect(g.kode_gejala, val, pilihan.id_pilihan);
                      }}
                    />
                  </div>

                  {/* DESKTOP */}
                  <div className="hidden md:flex items-center justify-between gap-4">
                    <div className="flex items-center gap-4 flex-1">
                      <span
                        className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold
                        ${isAnswered ? "bg-[#2F8F8B] text-white" : "bg-[#EAF6F6] text-[#2F8F8B]"}`}
                      >
                        {index + 1}
                      </span>
                      <p className="text-gray-800 text-base font-medium">{g.pertanyaan}</p>
                    </div>
                    <div className="w-80 shrink-0">
                      <CustomDropdown
                        options={options}
                        value={answers[g.kode_gejala] ?? ""}
                        onChange={(val) => {
                          const pilihan = g.tb_pilihan.find((p) => p.teks_pilihan === val);
                          if (pilihan) handleSelect(g.kode_gejala, val, pilihan.id_pilihan);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Jawaban terpilih */}
                {selectedLabel && (
                  <div className="mx-4 md:mx-6 mb-3 md:mb-4 px-3 md:px-4 py-2 rounded-xl flex items-center gap-2 text-xs md:text-sm font-medium bg-[#EAF6F6] border border-[#2F8F8B]/20 text-[#2F8F8B]">
                    <span>✓</span>
                    <span>{selectedLabel}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* TOMBOL DIAGNOSIS */}
        <div className="flex justify-center">
          <button
            onClick={handleDiagnosis}
            disabled={answered < total || loadingDiagnosis}
            className="bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold
              rounded-xl shadow-md shadow-[#2F8F8B]/25
              transition-all duration-300
              hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5
              disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0
              cursor-pointer
              text-base md:text-lg
              px-8 py-3 md:px-12 md:py-4
              w-full md:w-auto"
          >
            {loadingDiagnosis ? "Memproses..." : "Mulai Diagnosis"}
          </button>
        </div>
      </div>
    </div>
  );
}
