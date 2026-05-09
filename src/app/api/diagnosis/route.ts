import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const jawaban: Record<string, number> = body.jawaban;

    // LANGKAH 1: Ambil semua pilihan yang dipilih user beserta CF-nya
    const idPilihanList = Object.values(jawaban);
    const pilihanDipilih = await prisma.tb_pilihan_jawaban.findMany({
      where: { id_pilihan: { in: idPilihanList } },
    });

    // Buat map: kode_gejala -> cf_user
    const cfUserMap: Record<string, number> = {};
    for (const pilihan of pilihanDipilih) {
      const cfUser = Number(pilihan.nilai_cf_user);
      if (cfUser > 0) {
        cfUserMap[pilihan.kode_gejala.trim()] = cfUser;
      }
    }

    const gejalaAktifUser = new Set(Object.keys(cfUserMap));

    // LANGKAH 2: Ambil semua rule dari database
    const semuaAturan = await prisma.tb_aturan_basis_pengetahuan.findMany({
      include: { gejala: true },
    });

    const aturanPerKode: Record<string, typeof semuaAturan> = {};
    for (const aturan of semuaAturan) {
      const kode = aturan.kode_aturan.trim();
      if (!aturanPerKode[kode]) aturanPerKode[kode] = [];
      aturanPerKode[kode].push(aturan);
    }

    // LANGKAH 3: Cari rule yang aktif
    const ruleAktif: { kode_aturan: string; kode_penyakit: string; gejalaAktif: string[] }[] = [];

    for (const [kodeAturan, aturanList] of Object.entries(aturanPerKode)) {
      const kodePenyakit = aturanList[0].kode_diagnosis.trim();
      const semuaTerpenuhi = aturanList.every((a) => gejalaAktifUser.has(a.kode_gejala.trim()));
      if (!semuaTerpenuhi) continue;
      const gejalaAktif = aturanList.map((a) => a.kode_gejala.trim());
      ruleAktif.push({ kode_aturan: kodeAturan, kode_penyakit: kodePenyakit, gejalaAktif });
    }

    // LANGKAH 4: Tentukan hasil diagnosis
    let cfAkhir = 0;
    let kodePenyakitTerpilih: string;

    if (gejalaAktifUser.size === 1) {
      kodePenyakitTerpilih = "P3";
    } else if (ruleAktif.length === 0) {
      kodePenyakitTerpilih = "P2";
    } else {
      kodePenyakitTerpilih = "P1";
    }

    if (ruleAktif.length > 0) {
      kodePenyakitTerpilih = ruleAktif[0].kode_penyakit;

      const gejalaUnik = new Set<string>();
      for (const rule of ruleAktif) {
        for (const kg of rule.gejalaAktif) gejalaUnik.add(kg);
      }

      const dataGejala = await prisma.tb_gejala.findMany({
        where: { kode_gejala: { in: Array.from(gejalaUnik) } },
      });

      const cfPakarMap: Record<string, number> = {};
      for (const g of dataGejala) {
        cfPakarMap[g.kode_gejala.trim()] = Number(g.cf_pakar);
      }

      let cfCombine = 0;
      for (const kodeGejala of gejalaUnik) {
        const cfPakar = cfPakarMap[kodeGejala] ?? 0;
        const cfUser = cfUserMap[kodeGejala] ?? 0;
        const cfGejala = cfUser * cfPakar;
        cfCombine = cfCombine + cfGejala * (1 - cfCombine);
      }
      cfAkhir = cfCombine;
    }

    // LANGKAH 5: Ambil nama penyakit hasil diagnosis
    const diagnosis = await prisma.tb_diagnosis.findUnique({
      where: { kode_diagnosis: kodePenyakitTerpilih },
    });

    // LANGKAH 6: Ambil detail gejala yang dialami user
    const pilihanDenganGejala = await prisma.tb_pilihan_jawaban.findMany({
      where: { id_pilihan: { in: idPilihanList } },
      include: { gejala: true },
    });

    const gejalaTerdeteksi = pilihanDenganGejala
      .filter((p) => Number(p.nilai_cf_user) > 0)
      .map((p) => ({
        kode_gejala: p.kode_gejala.trim(),
        nama_gejala: p.gejala.nama_gejala,
        jawaban: p.teks_pilihan,
        nilai_cf_user: Number(p.nilai_cf_user),
        id_pilihan: p.id_pilihan,
      }));

    // LANGKAH 7: Simpan ke database tb_konsultasi
    const konsultasiBaru = await prisma.tb_konsultasi.create({
      data: {
        kode_diagnosis: kodePenyakitTerpilih,
        cf_akhir: cfAkhir,
        // penjelasan_llm akan diisi oleh /api/narasi nanti
      },
    });

    // Simpan detail gejala ke tb_detail_konsultasi
    // Hanya simpan gejala yang cf_user > 0 (yang terdeteksi)
    if (gejalaTerdeteksi.length > 0) {
      await prisma.tb_detail_konsultasi.createMany({
        data: gejalaTerdeteksi.map((g) => ({
          id_konsultasi: konsultasiBaru.id_konsultasi,
          kode_gejala: g.kode_gejala,
          id_pilihan: g.id_pilihan,
          cf_user: g.nilai_cf_user,
        })),
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        id_konsultasi: konsultasiBaru.id_konsultasi,
        kode_penyakit: kodePenyakitTerpilih,
        nama_penyakit: diagnosis?.nama_diagnosis ?? "Tidak diketahui",
        cf_akhir: Math.round(parseFloat((cfAkhir * 100).toFixed(2))),
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
