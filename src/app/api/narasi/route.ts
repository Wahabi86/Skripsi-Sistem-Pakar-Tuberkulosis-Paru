import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const flaskResponse = await fetch("http://127.0.0.1:5000/narasi", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status_diagnosis: body.status_diagnosis,
        cf_akhir: body.cf_akhir,
        gejala_terdeteksi: body.gejala_terdeteksi,
      }),
    });

    const flaskData = await flaskResponse.json();

    if (!flaskData.success) {
      return NextResponse.json({ success: false, message: flaskData.message }, { status: 500 });
    }

    if (body.id_konsultasi) {
      await prisma.tb_konsultasi.update({
        where: { id_konsultasi: body.id_konsultasi },
        data: { penjelasan_llm: flaskData.narasi },
      });
    }
    
    return NextResponse.json({ success: true, narasi: flaskData.narasi });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, message: "Gagal menghubungi RAG server" }, { status: 500 });
  }
}
