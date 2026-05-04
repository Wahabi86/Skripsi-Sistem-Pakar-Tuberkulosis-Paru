import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jawaban: Record<string, number> = body.jawaban;

    // 1. Ambil semua pilihan yang dipilih user beserta nilai CF-nya
    const idPilihanList = Object.values(jawaban);
    const pilihanDipilih = await prisma.tb_pilihan_jawaban.findMany({
      where: { id_pilihan: { in: idPilihanList } },
    });

    // Buat map: kode_gejala -> nilai_cf_user
    const cfUserMap: Record<string, number> = {};
    for (const pilihan of pilihanDipilih) {
      cfUserMap[pilihan.kode_gejala.trim()] = Number(pilihan.nilai_cf_user);
    }

    // 2. Ambil semua aturan/rule base dari database
    const semuaAturan = await prisma.tb_aturan_basis_pengetahuan.findMany({
      include: {
        gejala: true,
      },
    });

    // 3. Kelompokkan aturan per kode_aturan
    const aturanPerKode: Record<string, typeof semuaAturan> = {};
    for (const aturan of semuaAturan) {
      if (!aturanPerKode[aturan.kode_aturan]) {
        aturanPerKode[aturan.kode_aturan] = [];
      }
      aturanPerKode[aturan.kode_aturan].push(aturan);
    }

    // 4. Cek aturan yang aktif, lalu hitung CF
    const hasilPerPenyakit: Record<string, number> = {};

    for (const aturanList of Object.values(aturanPerKode)) {
      const kodePenyakit = aturanList[0].kode_penyakit;

      // Cek apakah aturan ini AKTIF
      // Aturan aktif jika semua kondisi gejala terpenuhi:
      const aturanAktif = aturanList.every((aturan) => {
        const cfUser = cfUserMap[aturan.kode_gejala.trim()] ?? 0;
        if (aturan.is_negasi) {
          return cfUser === 0; // negasi aktif jika gejala TIDAK ada
        } else {
          return cfUser > 0; // normal aktif jika gejala ADA
        }
      });

      // Skip aturan yang tidak aktif
      if (!aturanAktif) continue;

      // Rumus 1: Hitung CF tiap gejala dalam aturan
      const cfGejalaList: number[] = [];

      for (const aturan of aturanList) {
        const cfPakar = Number(aturan.gejala.cf_pakar);
        const cfUser = cfUserMap[aturan.kode_gejala.trim()] ?? 0;

        let cfGejala: number;
        if (aturan.is_negasi) {
          // Rumus negasi: cf_pakar × (1 - cf_user)
          cfGejala = cfPakar * (1 - cfUser);
        } else {
          // Rumus normal: cf_pakar × cf_user
          cfGejala = cfPakar * cfUser;
        }

        cfGejalaList.push(cfGejala);
      }

      // Rumus 2: Combine semua gejala dalam 1 aturan
      // Selalu dijalankan untuk setiap aturan yang aktif
      let cfAturan = 0;
      for (const cf of cfGejalaList) {
        cfAturan = cfAturan + cf * (1 - cfAturan);
      }

      // Rumus 2: Combine CF aturan ini ke hasil penyakit
      // Hanya berjalan jika ada lebih dari 1 aruran aktif
      if (hasilPerPenyakit[kodePenyakit] === undefined) {
        hasilPerPenyakit[kodePenyakit] = cfAturan;
      } else {
        const cfLama = hasilPerPenyakit[kodePenyakit];
        hasilPerPenyakit[kodePenyakit] = cfLama + cfAturan * (1 - cfLama);
      }
    }

    // 5. Tentukan hasil diagnosis
    let kodePenyakitTerpilih: string;
    let cfTertinggi: number;

    if (hasilPerPenyakit["P1"] && hasilPerPenyakit["P1"] > 0) {
      // Ada aturan P1 yang aktif → Terindikasi TBC
      kodePenyakitTerpilih = "P1";
      cfTertinggi = hasilPerPenyakit["P1"];
    } else {
      // Tidak ada aturan P1 yang aktif → Tidak Terindikasi TBC
      kodePenyakitTerpilih = "P2";
      cfTertinggi = hasilPerPenyakit["P2"] ?? 0;
    }

    // 6. Ambil nama penyakit
    const penyakit = await prisma.tb_penyakit.findUnique({
      where: { kode_penyakit: kodePenyakitTerpilih },
    });

    // 7. Ambil detail gejala yang dijawab user (untuk ditampilkan di halaman hasil)
    const pilihanDenganGejala = await prisma.tb_pilihan_jawaban.findMany({
      where: { id_pilihan: { in: idPilihanList } },
      include: { gejala: true },
    });

    // 8. Filter hanya gejala yang BUKAN jawaban paling sehat (cf_user > 0)
    // Jawaban paling sehat = nilai_cf_user = 0 (pilihan terakhir di database)
    const gejalaTerdeteksi = pilihanDenganGejala
      .filter((p) => Number(p.nilai_cf_user) > 0)
      .map((p) => ({
        kode_gejala: p.kode_gejala.trim(),
        nama_gejala: p.gejala.nama_gejala,
        jawaban: p.teks_pilihan,
        nilai_cf_user: Number(p.nilai_cf_user),
      }));

    return NextResponse.json({
      success: true,
      data: {
        kode_penyakit: kodePenyakitTerpilih,
        nama_penyakit: penyakit?.nama_penyakit ?? "Tidak diketahui",
        cf_akhir: Math.round(cfTertinggi * 100),
        cf_detail: hasilPerPenyakit,
        gejala_terdeteksi: gejalaTerdeteksi,
        tanggal: new Date().toLocaleDateString("id-ID"),
        jumlah_gejala: gejalaTerdeteksi.length,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal memproses diagnosis" }, { status: 500 });
  }
}
