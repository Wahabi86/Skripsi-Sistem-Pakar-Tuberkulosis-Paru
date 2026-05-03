import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const gejala = await prisma.tb_gejala.findMany({
      include: {
        tb_pilihan: {
          orderBy: { urutan: "asc" },
        },
      },
    });

    // Sort berdasarkan angka di belakang kode gejala
    gejala.sort((a, b) => {
      const angkaA = parseInt(a.kode_gejala.replace(/\D/g, ""));
      const angkaB = parseInt(b.kode_gejala.replace(/\D/g, ""));
      return angkaA - angkaB;
    });

    return NextResponse.json({ success: true, data: gejala });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal mengambil data gejala" }, { status: 500 });
  }
}
