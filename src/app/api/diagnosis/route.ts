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
    // Hanya simpan gejala yang cf_user > 0 (gejala yang benar-benar dialami)
    const cfUserMap: Record<string, number> = {};
    for (const pilihan of pilihanDipilih) {
      const cfUser = Number(pilihan.nilai_cf_user);
      if (cfUser > 0) {
        cfUserMap[pilihan.kode_gejala.trim()] = cfUser;
      }
    }

    // Daftar kode gejala yang dialami user (cf_user > 0)
    const gejalaAktifUser = new Set(Object.keys(cfUserMap));

    // LANGKAH 2: Ambil semua rule dari database beserta data gejala
    const semuaAturan = await prisma.tb_aturan_basis_pengetahuan.findMany({
      include: { gejala: true },
    });

    // Kelompokkan aturan per kode_aturan
    // Hasil: { "R1": [...], "R2": [...], ... }
    const aturanPerKode: Record<string, typeof semuaAturan> = {};
    for (const aturan of semuaAturan) {
      const kode = aturan.kode_aturan.trim();
      if (!aturanPerKode[kode]) {
        aturanPerKode[kode] = [];
      }
      aturanPerKode[kode].push(aturan);
    }

    // LANGKAH 3: Cari rule yang AKTIF (100% gejalanya terpenuhi penuh)
    // Rule aktif = semua gejala dalam rule ada di jawaban user (cf_user > 0)
    const ruleAktif: { kode_aturan: string; kode_penyakit: string; gejalaAktif: string[] }[] = [];

    for (const [kodeAturan, aturanList] of Object.entries(aturanPerKode)) {
      const kodePenyakit = aturanList[0].kode_diagnosis.trim();

      // Cek apakah SEMUA gejala dalam rule ini ada di jawaban user
      const semuaTerpenuhi = aturanList.every((aturan) => gejalaAktifUser.has(aturan.kode_gejala.trim()));

      // Jika tidak semua terpenuhi, rule ini tidak aktif → skip
      if (!semuaTerpenuhi) continue;

      // Kumpulkan kode gejala yang ada di rule ini
      const gejalaAktif = aturanList.map((aturan) => aturan.kode_gejala.trim());

      ruleAktif.push({ kode_aturan: kodeAturan, kode_penyakit: kodePenyakit, gejalaAktif });
    }

    // LANGKAH 4: Tentukan hasil diagnosis awal
    // Jika hanya 1 gejala aktif → P3 (perlu pemeriksaan lanjutan)
    // Jika tidak ada rule aktif → P2 (tidak terindikasi)
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
      // Semua rule aktif pasti P1 (karena hanya P1 yang ada di rule base)
      kodePenyakitTerpilih = ruleAktif[0].kode_penyakit;

      // LANGKAH 5: Kumpulkan gejala UNIK dari semua rule aktif
      // Contoh: R1(G1,G2) + R2(G1,G3) + R3(G2,G3) → {G1, G2, G3}
      const gejalaUnik = new Set<string>();
      for (const rule of ruleAktif) {
        for (const kg of rule.gejalaAktif) {
          gejalaUnik.add(kg);
        }
      }

      // LANGKAH 6: Ambil cf_pakar dari database untuk gejala unik
      const dataGejala = await prisma.tb_gejala.findMany({
        where: { kode_gejala: { in: Array.from(gejalaUnik) } },
      });

      // Buat map: kode_gejala -> cf_pakar
      const cfPakarMap: Record<string, number> = {};
      for (const g of dataGejala) {
        cfPakarMap[g.kode_gejala.trim()] = Number(g.cf_pakar);
      }

      // LANGKAH 7: Hitung CF per gejala unik lalu combine sekaligus
      // Rumus 1: CF per gejala = CFUser × CFPakar
      // Rumus 2: CFcombine = CFold + CFnew × (1 - CFold) → iteratif
      let cfCombine = 0;

      for (const kodeGejala of gejalaUnik) {
        const cfPakar = cfPakarMap[kodeGejala] ?? 0;
        const cfUser = cfUserMap[kodeGejala] ?? 0;

        // Rumus 1
        const cfGejala = cfUser * cfPakar;

        // Rumus 2
        cfCombine = cfCombine + cfGejala * (1 - cfCombine);
      }

      cfAkhir = cfCombine;
    }

    // LANGKAH 8: Ambil nama penyakit hasil diagnosis
    const diagnosis = await prisma.tb_diagnosis.findUnique({
      where: { kode_diagnosis: kodePenyakitTerpilih },
    });

    // LANGKAH 9: Ambil detail gejala yang dialami user (untuk ditampilkan)
    // Hanya gejala dengan cf_user > 0
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
      }));

    // LANGKAH 10: Return hasil ke frontend
    return NextResponse.json({
      success: true,
      data: {
        kode_penyakit: kodePenyakitTerpilih,
        nama_penyakit: diagnosis?.nama_diagnosis ?? "Tidak diketahui",
        cf_akhir: Math.round(cfAkhir * 100),
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
