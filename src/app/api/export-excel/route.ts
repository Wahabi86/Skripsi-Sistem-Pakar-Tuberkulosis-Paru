import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import * as XLSX from "xlsx";

export async function GET() {
  try {
    // Ambil semua data konsultasi beserta detailnya dari database
    const semuaKonsultasi = await prisma.tb_konsultasi.findMany({
      orderBy: { tanggal_konsultasi: "asc" },
      include: {
        diagnosis: true,
        tb_detail: {
          include: {
            gejala: true,
            pilihan: true,
          },
        },
      },
    });

    // Ambil semua rule dari database (untuk cek rule aktif)
    const semuaAturan = await prisma.tb_aturan_basis_pengetahuan.findMany({
      include: { gejala: true },
    });

    // Kelompokkan rule per kode_aturan
    const aturanPerKode: Record<string, typeof semuaAturan> = {};
    for (const aturan of semuaAturan) {
      const kode = aturan.kode_aturan.trim();
      if (!aturanPerKode[kode]) aturanPerKode[kode] = [];
      aturanPerKode[kode].push(aturan);
    }

    // Susun data menjadi baris-baris untuk Excel
    const baris = semuaKonsultasi.map((k, index) => {
      // Gabungkan semua gejala terdeteksi menjadi 1 teks
      const daftarGejala = k.tb_detail.map((d) => `[${d.gejala.kode_gejala.trim()}] ${d.gejala.nama_gejala}: ${d.pilihan.teks_pilihan}`).join(" | ");

      // Kumpulkan kode gejala yang aktif pada konsultasi ini
      const gejalaAktif = new Set(k.tb_detail.map((d) => d.kode_gejala.trim()));

      // Cari rule yang aktif: semua gejala dalam rule harus ada di gejalaAktif
      const ruleAktif: string[] = [];
      for (const [kodeAturan, aturanList] of Object.entries(aturanPerKode)) {
        const semuaTerpenuhi = aturanList.every((a) => gejalaAktif.has(a.kode_gejala.trim()));
        if (semuaTerpenuhi) {
          // Kumpulkan gejala dalam rule ini untuk ditampilkan
          const gejalaRule = aturanList.map((a) => a.kode_gejala.trim()).join(", ");
          ruleAktif.push(`${kodeAturan} (${gejalaRule})`);
        }
      }

      const daftarRuleAktif = ruleAktif.length > 0 ? ruleAktif.join(" | ") : "Tidak ada rule aktif";

      return {
        No: index + 1,
        "Tanggal Konsultasi": new Date(k.tanggal_konsultasi).toLocaleString("id-ID"),
        "Status Diagnosis": k.diagnosis.nama_diagnosis,
        "Nilai CF (%)": Math.round(Number(k.cf_akhir) * 100),
        "Gejala & Jawaban": daftarGejala,
        "Rule Aktif": daftarRuleAktif,
        "Penjelasan RAG-LLM": k.penjelasan_llm ?? "Belum ada penjelasan",
      };
    });

    // Buat workbook Excel
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(baris);

    // Atur lebar kolom
    worksheet["!cols"] = [
      { wch: 5 }, // No
      { wch: 22 }, // Tanggal
      { wch: 35 }, // Status Diagnosis
      { wch: 15 }, // Nilai CF
      { wch: 80 }, // Gejala & Jawaban
      { wch: 50 }, // Rule Aktif
      { wch: 100 }, // Penjelasan LLM
    ];

    XLSX.utils.book_append_sheet(workbook, worksheet, "Data Konsultasi");

    // Konversi workbook ke buffer
    const excelBuffer = XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });

    // Nama file dengan tanggal hari ini
    const tanggalSekarang = new Date().toISOString().slice(0, 10);
    const namaFile = `data_konsultasi_tbc_${tanggalSekarang}.xlsx`;

    // Kembalikan sebagai file download
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="${namaFile}"`,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal export Excel" }, { status: 500 });
  }
}
