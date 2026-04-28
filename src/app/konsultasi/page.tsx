"use client";

import { useState } from "react";
import { questions } from "@/lib/data/pertanyaan";

export default function KonsultasiPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const answered = Object.values(answers).filter((v) => v !== null).length;
  const total = questions.length;
  const percentage = Math.round((answered / total) * 100);

  const handleSelect = (questionId: string, label: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: label }));
  };

  return (
    <div className="min-h-screen  py-10 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
        {/* Judul */}
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6">Form Konsultasi Gejala Tuberkulosis Paru</h1>

        {/* Progress */}
        <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
          <div className="flex justify-between text-base text-gray-600 mb-2">
            <span>
              Pertanyaan Terisi {answered} dari {total} Gejala
            </span>
            <span className="font-semibold">{percentage}%</span>
          </div>
          {/* Bar utama */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3">
            <div className="bg-gray-800 h-3 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
          </div>
          {/* Indikator per soal */}
          <div className="flex gap-2 flex-wrap">
            {questions.map((q) => (
              <div key={q.id} className={`h-2 flex-1 rounded-full transition-all duration-300 ${answers[q.id] !== undefined ? "bg-gray-800" : "bg-gray-300"}`} />
            ))}
          </div>
        </div>

        {/* Instruksi */}
        <p className="text-center text-gray-600 text-base mb-6">Silakan jawab pertanyaan berikut sesuai kondisi yang Anda rasakan</p>

        {/* Daftar Pertanyaan */}
        <div className="flex flex-col gap-4 mb-8">
          {questions.map((q, index) => {
            const selectedLabel = answers[q.id] ?? null;

            return (
              <div key={q.id} className="bg-gray-50 rounded-xl px-6 py-5 border border-gray-200">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-gray-800 text-base font-medium flex-1">
                    {index + 1}. {q.question}
                  </p>
                  <select className="border border-gray-300 rounded-lg px-4 py-2 text-sm text-gray-700 bg-gray-50 cursor-pointer w-72 shrink-0" value={answers[q.id] ?? ""} onChange={(e) => handleSelect(q.id, e.target.value)}>
                    <option value="" disabled>
                      Pilih
                    </option>
                    {q.options.map((opt) => (
                      <option key={opt.label} value={opt.label}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Jawaban lengkap muncul di bawah setelah dipilih */}
                {selectedLabel && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    {(() => {
                      const lastOption = q.options[q.options.length - 1].label;
                      const isHealthy = answers[q.id] === lastOption;
                      return (
                        <span className={`text-sm px-3 py-1 rounded-full ${isHealthy ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}>
                          {isHealthy ? "✓ " : "⚠ "}
                          {selectedLabel}
                        </span>
                      );
                    })()}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Tombol */}
        <div className="flex justify-center">
          <button
            className="bg-white text-gray-800 font-semibold text-lg px-10 py-3 rounded-full border-2 border-gray-300 shadow-sm hover:border-gray-400 hover:shadow-md transition-all duration-200 disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            disabled={answered < total}
          >
            Mulai Diagnosis
          </button>
        </div>
      </div>
    </div>
  );
}
