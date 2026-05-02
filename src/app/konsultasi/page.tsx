"use client";

import { useState, useRef, useEffect } from "react";
import { questions } from "@/lib/data/pertanyaan";
import { IoIosArrowDown } from "react-icons/io";

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
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answered = Object.values(answers).filter((v) => v !== "").length;
  const total = questions.length;
  const percentage = Math.round((answered / total) * 100);

  const handleSelect = (questionId: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
  };

  const isHealthy = (questionId: string) => {
    const q = questions.find((q) => q.id === questionId);
    if (!q) return false;
    return answers[questionId] === q.options[q.options.length - 1].label;
  };

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
            {questions.map((q) => (
              <div key={q.id} className={`h-2 flex-1 rounded-full transition-all duration-300 ${answers[q.id] ? "bg-[#2F8F8B]" : "bg-gray-300"}`} />
            ))}
          </div>
        </div>

        {/* Daftar Pertanyaan */}
        <div className="flex flex-col gap-4 mb-8">
          {questions.map((q, index) => {
            const selectedLabel = answers[q.id] ?? null;
            const answered = !!selectedLabel;
            const healthy = answered && isHealthy(q.id);
            const risky = answered && !healthy;

            return (
              <div
                key={q.id}
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
                    <p className="text-gray-800 text-base font-medium">{q.question}</p>
                  </div>

                  {/* Dropdown */}
                  <CustomDropdown options={q.options} value={answers[q.id] ?? ""} onChange={(val) => handleSelect(q.id, val)} />
                </div>

                {/* Jawaban terpilih */}
                {selectedLabel && (
                  <div
                    className={`mx-6 mb-4 px-4 py-2 rounded-xl flex items-center gap-2 text-sm font-medium
                    ${healthy ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-600"}`}
                  >
                    <span>{healthy ? "✓" : "⚠"}</span>
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
            className="bg-[#2F8F8B] hover:bg-[#277C78] text-white font-semibold text-lg px-12 py-4 rounded-xl shadow-md shadow-[#2F8F8B]/25 transition-all duration-300 hover:shadow-lg hover:shadow-[#2F8F8B]/30 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 cursor-pointer"
            disabled={answered < total}
          >
            Mulai Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
}
