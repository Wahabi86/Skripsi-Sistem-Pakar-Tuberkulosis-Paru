import os
import re
import pickle
from dotenv import load_dotenv
import numpy as np
import faiss
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentence_transformers import SentenceTransformer
import requests

# Load .env dari folder root proyek (satu level di atas folder rag/)
load_dotenv(os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", ".env"))

# INISIALISASI FLASK
app = Flask(__name__)
CORS(app)

# LOAD SEMUA FILE DAN MODEL (dijalankan sekali saat Flask start)
print("Memuat model dan data...")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

embeddings = np.load(os.path.join(BASE_DIR, "embeddings.npy"))
chunk_source_index = np.load(os.path.join(BASE_DIR, "chunk_source_index.npy"))
with open(os.path.join(BASE_DIR, "all_chunks.pkl"), "rb") as f:
    all_chunks = pickle.load(f)

embedding_model = SentenceTransformer("paraphrase-multilingual-mpnet-base-v2")

embeddings_normalized = embeddings.copy().astype("float32")
faiss.normalize_L2(embeddings_normalized)
index = faiss.IndexFlatIP(embeddings.shape[1])
index.add(embeddings_normalized)

OPENROUTER_API_KEY = os.environ.get("OPENROUTER_API_KEY")

print(f"✓ Selesai! Total chunks: {len(all_chunks)}, Vectors: {index.ntotal}")

# MAPPING LABEL CF USER
CF_USER_LABEL_PER_GEJALA = {
    "G1": {
        1.0: "Sudah lebih dari 2 minggu dan masih berlanjut",
        0.6: "Sudah sekitar 2 minggu",
        0.4: "Kurang dari 2 minggu",
        0.0: "Tidak sedang batuk",
    },
    "G2": {
        1.0: "Ya, selalu keluar dahak setiap batuk",
        0.6: "Kadang-kadang ada dahak, tidak setiap batuk",
        0.4: "Jarang, dahaknya sedikit",
        0.0: "Tidak ada dahak sama sekali",
    },
    "G3": {
        1.0: "Ya, darah keluar setiap kali batuk",
        0.8: "Ya, sudah beberapa kali terjadi",
        0.6: "Pernah sekali, dahak berwarna kemerahan",
        0.0: "Tidak pernah",
    },
    "G4": {
        1.0: "Ya, nyeri dada terasa terus-menerus bahkan saat istirahat",
        0.8: "Ya, nyeri muncul terutama saat batuk atau bernapas dalam",
        0.6: "Ada rasa tidak nyaman di dada, tapi tidak sampai nyeri",
        0.0: "Tidak ada nyeri dada sama sekali",
    },
    "G5": {
        1.0: "Ya, sesak napas bahkan saat istirahat",
        0.8: "Ya, sesak muncul saat aktivitas ringan",
        0.4: "Sesak hanya muncul saat aktivitas berat",
        0.0: "Tidak mengalami sesak napas",
    },
    "G6": {
        1.0: "Ya, hampir setiap hari terasa sangat lemas hingga sulit beraktivitas",
        0.8: "Ya, sering merasa lemas meski tidak banyak beraktivitas",
        0.4: "Kadang-kadang merasa lemas, tidak menentu",
        0.0: "Tidak, kondisi tubuh normal dan bertenaga",
    },
    "G7": {
        1.0: "Ya, berat badan turun cukup signifikan belakangan ini",
        0.6: "Sedikit berkurang, tapi tidak terlalu terasa",
        0.0: "Tidak ada penurunan berat badan",
    },
    "G8": {
        1.0: "Ya, hampir tidak mau makan sama sekali",
        0.8: "Ya, porsi makan berkurang dari biasanya",
        0.6: "Kadang tidak nafsu makan, tidak setiap hari",
        0.0: "Nafsu makan normal seperti biasa",
    },
    "G9": {
        1.0: "Ya, demam tinggi yang berlangsung terus-menerus",
        0.6: "Ya, demam ringan yang hilang timbul",
        0.4: "Kadang-kadang merasa hangat, tidak pasti demam",
        0.0: "Tidak ada demam",
    },
    "G10": {
        1.0: "Ya, hampir setiap malam berkeringat banyak meski tidak kepanasan",
        0.6: "Ya, beberapa kali dalam seminggu",
        0.4: "Pernah terjadi, tapi jarang",
        0.0: "Tidak pernah",
    },
}


def get_label_kepastian(cf_akhir: float) -> str:
    if cf_akhir >= 75:
        return "Tinggi"
    elif cf_akhir >= 50:
        return "Cukup"
    else:
        return "Rendah"


# ENDPOINT UTAMA: POST /narasi
@app.route("/narasi", methods=["POST"])
def generate_narasi():
    try:
        # Ambil data dari request Next.js
        body = request.get_json()
        status_diagnosis = body.get("status_diagnosis")
        cf_akhir = float(body.get("cf_akhir"))
        gejala_terdeteksi = body.get("gejala_terdeteksi")

        # LANGKAH 1: Bangun daftar gejala dengan label jawaban
        rincian_gejala = []
        for g in gejala_terdeteksi:
            kode = g["kode_gejala"].strip()
            cf_user_val = float(g["nilai_cf_user"])
            nama = g["nama_gejala"]

            mapping = CF_USER_LABEL_PER_GEJALA.get(kode, {})
            jawaban = mapping.get(cf_user_val, g.get("jawaban", ""))

            rincian_gejala.append({
                "kode": kode,
                "nama": nama,
                "cf_user": cf_user_val,
                "jawaban": jawaban,
            })

        # LANGKAH 2: Bangun query retrieval
        deskripsi_gejala = "; ".join([
            f"{g['nama']}: {g['jawaban']}" for g in rincian_gejala
        ])

        if "Tidak Terindikasi" in status_diagnosis:
            query_retrieval = (
                f"pasien tidak terindikasi tuberkulosis paru. "
                f"keluhan yang dilaporkan: {deskripsi_gejala}"
            )
        elif "Perlu Pemeriksaan Lanjut" in status_diagnosis:
            query_retrieval = (
                f"pasien belum dapat dipastikan tuberkulosis paru, perlu pemeriksaan lanjut. "
                f"keluhan yang dilaporkan: {deskripsi_gejala}"
            )
        else:
            query_retrieval = (
                f"pasien terindikasi tuberkulosis paru. "
                f"keluhan yang dilaporkan: {deskripsi_gejala}"
            )

        # LANGKAH 3: Embedding query
        query_embedding = embedding_model.encode([query_retrieval])
        query_embedding = query_embedding.astype("float32")
        faiss.normalize_L2(query_embedding)

        # LANGKAH 4: Retrieval dari FAISS
        k_candidates = 15
        k_final = 5
        _, indices = index.search(query_embedding, k_candidates)

        candidate_chunks = [all_chunks[i] for i in indices[0]]
        candidate_source = [chunk_source_index[i] for i in indices[0]]

        selected_chunks = []
        selected_sources = set()
        for chunk, source in zip(candidate_chunks, candidate_source):
            if source not in selected_sources:
                selected_chunks.append(chunk)
                selected_sources.add(source)
            if len(selected_chunks) >= k_final:
                break

        retrieved_text = "\n\n".join(selected_chunks)

        # LANGKAH 5: Susun prompt
        label_kepastian = get_label_kepastian(cf_akhir)
        cf_akhir_int = int(cf_akhir)

        daftar_gejala_teks = ""
        for g in rincian_gejala:
            daftar_gejala_teks += f"- {g['nama']}: {g['jawaban']}\n"

        # Bangun detail gejala untuk instruksi prompt
        detail_gejala_instruksi = ""
        for g in rincian_gejala:
            detail_gejala_instruksi += f'  - Gejala "{g["nama"]}" dengan kondisi pasien: "{g["jawaban"]}"\n'

        # Tentukan instruksi paragraf berdasarkan status diagnosis
        if "Terindikasi Tuberkulosis Paru" in status_diagnosis and "Tidak" not in status_diagnosis:
            data_cf_teks = f"- NILAI KEPASTIAN: {cf_akhir_int}% (Kategori: {label_kepastian})"

            paragraf1_instruksi = f"""PARAGRAF 1 — ISI (maksimal 5 kalimat, JANGAN gunakan bullet/daftar):
Mulai dengan menyampaikan bahwa pasien terindikasi TBC dengan kepastian {cf_akhir_int}% artinya pola gejala sangat cocok dengan TBC.
Kemudian untuk SETIAP gejala berikut, jelaskan dalam kalimat mengalir (bukan daftar):
  (1) Apa yang sedang terjadi di dalam tubuh sehingga gejala itu muncul — jelaskan proses biologisnya dengan bahasa sederhana
  (2) Mengapa kondisi yang dilaporkan pasien menunjukkan ini sudah serius atau perlu diwaspadai
  (3) Bagaimana gejala-gejala ini saling memperkuat satu sama lain sehingga mengarah ke TBC

Daftar gejala yang harus dijelaskan:
{detail_gejala_instruksi}
Tulis semua penjelasan gejala dalam 1 paragraf mengalir, bukan poin-poin."""

            paragraf2_instruksi = """PARAGRAF 2 — ISI (maksimal 4 kalimat, JANGAN gunakan bullet/daftar):
Jelaskan langkah konkret: segera periksa ke dokter dengan tes dahak dan rontgen dada.
Jelaskan mengapa OAT harus diminum tuntas (bukan sekadar "6 bulan") — apa akibatnya jika tidak tuntas.
Tutup dengan 1 kalimat edukasi TOSS TBC (tutup mulut saat batuk untuk cegah penularan).
Tulis semua dalam 1 paragraf mengalir."""

        elif "Tidak Terindikasi" in status_diagnosis:
            data_cf_teks = ""

            # Jika tidak ada gejala sama sekali, beri instruksi khusus
            if not rincian_gejala:
                paragraf1_instruksi = """PARAGRAF 1 — ISI (maksimal 4 kalimat, JANGAN gunakan bullet/daftar):
Sampaikan bahwa pasien tidak melaporkan gejala apapun yang mengarah ke TBC berdasarkan hasil konsultasi.
Jelaskan bahwa ini adalah hasil yang baik, namun tetap penting untuk menjaga kesehatan paru-paru.
Tulis dalam 1 paragraf mengalir. JANGAN menyebutkan atau mengarang gejala yang tidak ada."""

                paragraf2_instruksi = """PARAGRAF 2 — ISI (maksimal 4 kalimat, JANGAN gunakan bullet/daftar):
Sebutkan dalam kalimat mengalir gejala khas TBC yang perlu diwaspadai ke depan (batuk lebih dari 2 minggu, batuk darah, keringat malam, demam hilang timbul, berat badan turun).
Tutup dengan saran menjaga daya tahan tubuh dan anjuran periksa dokter jika gejala tersebut muncul di kemudian hari."""

            else:
                paragraf1_instruksi = f"""PARAGRAF 1 — ISI (maksimal 4 kalimat, JANGAN gunakan bullet/daftar):
Sampaikan bahwa pola gejala yang dilaporkan belum cukup mengarah ke TBC.
Untuk setiap gejala berikut, jelaskan dalam kalimat mengalir MENGAPA gejala tersebut dengan kondisi yang dilaporkan pasien belum cukup kuat menunjukkan TBC — bisa disebabkan kondisi lain yang lebih ringan:
{detail_gejala_instruksi}
Jangan sebut nilai persentase apapun. Tulis dalam 1 paragraf mengalir."""

                paragraf2_instruksi = """PARAGRAF 2 — ISI (maksimal 4 kalimat, JANGAN gunakan bullet/daftar):
Sebutkan dalam kalimat mengalir gejala khas TBC yang perlu diwaspadai ke depan (batuk lebih dari 2 minggu, batuk darah, keringat malam, demam hilang timbul, berat badan turun).
Tutup dengan saran menjaga daya tahan tubuh dan anjuran periksa dokter jika gejala bertambah atau memburuk."""

        else:
            # Status: Perlu Pemeriksaan Lanjut (hanya 1 gejala terdeteksi)
            data_cf_teks = ""

            paragraf1_instruksi = f"""PARAGRAF 1 — ISI (maksimal 4 kalimat, JANGAN gunakan bullet/daftar):
Sampaikan bahwa hanya 1 gejala yang dilaporkan sehingga belum bisa disimpulkan apapun.
Jelaskan dalam kalimat mengalir bahwa gejala berikut memang bisa menjadi tanda awal TBC, TAPI juga bisa disebabkan banyak kondisi lain yang lebih ringan — jelaskan alasannya:
{detail_gejala_instruksi}
Jangan sebut nilai persentase apapun. Tulis dalam 1 paragraf mengalir."""

            paragraf2_instruksi = """PARAGRAF 2 — ISI (maksimal 4 kalimat, JANGAN gunakan bullet/daftar):
Sarankan memeriksakan diri ke dokter sebagai langkah waspada.
Sebutkan dalam kalimat mengalir gejala TBC lain yang perlu diperhatikan ke depannya agar pasien tetap waspada."""

        # Tentukan teks gejala untuk prompt
        if rincian_gejala:
            bagian_gejala = f"- DAFTAR GEJALA & JAWABAN PASIEN:\n{daftar_gejala_teks}"
        else:
            bagian_gejala = "- DAFTAR GEJALA & JAWABAN PASIEN: TIDAK ADA. Pasien tidak melaporkan gejala apapun. JANGAN menyebut atau mengarang gejala apapun dalam narasi."

        final_prompt = f"""
Anda adalah sistem pendukung diagnosis TBC (Tuberkulosis Paru) yang bertugas menjelaskan hasil diagnosis kepada pasien awam.
Tugas Anda: Menjelaskan MENGAPA gejala-gejala yang dialami pasien bisa mengarah ke TBC berdasarkan kondisi spesifik yang dilaporkan pasien, apa artinya secara medis, dan apa yang harus dilakukan — dengan bahasa hangat, mudah dipahami, dan tidak menakut-nakuti.

DATA DIAGNOSIS:
- STATUS AKHIR: {status_diagnosis}
{data_cf_teks}
{bagian_gejala}

REFERENSI MEDIS (DARI ALODOKTER):
{retrieved_text}

PEDOMAN PENULISAN:

{paragraf1_instruksi}

{paragraf2_instruksi}

PANTANGAN — WAJIB DIPATUHI:
- HANYA 2 PARAGRAF, tidak lebih tidak kurang
- JANGAN gunakan format Markdown seperti **teks**, *teks*, bullet *, atau heading ##
- JANGAN gunakan salam pembuka atau basa-basi (Halo, Selamat Pagi, Bapak/Ibu, dll)
- JANGAN hanya menyebutkan ulang nama gejala — WAJIB jelaskan mengapa gejala itu bisa terjadi pada TBC dan apa artinya berdasarkan jawaban pasien
- JANGAN gunakan istilah teknis tanpa penjelasan
- JANGAN sebutkan nama dokter atau instansi Alodokter
- JANGAN memberikan diagnosis yang bertentangan dengan status: {status_diagnosis}
- JANGAN gunakan angka desimal seperti 0.8 atau 0.6
- LANGSUNG masuk ke teks penjelasan tanpa judul, tanpa label paragraf
- JANGAN berhalusinasi atau menambahkan informasi medis yang tidak berdasar
- TULIS dalam bentuk paragraf biasa yang mengalir, bukan poin-poin atau daftar
- Setiap paragraf maksimal 5 kalimat, padat dan to the point
- JIKA tidak ada gejala yang dilaporkan, JANGAN SEKALI-KALI menyebut atau mengarang gejala apapun
"""

        # LANGKAH 6: Panggil OpenRouter (Gemini 2.5 Flash)
        response = requests.post(
            url="https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {OPENROUTER_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": "google/gemini-2.5-flash",
                "messages": [
                    {"role": "user", "content": final_prompt}
                ],
                "temperature": 0.2,
                "top_p": 0.8,
            }
        )

        response_json = response.json()
        narasi = response_json["choices"][0]["message"]["content"]

        # Bersihkan formatting Markdown dari output Gemini
        narasi = re.sub(r'\*\*(.+?)\*\*', r'\1', narasi)
        narasi = re.sub(r'\*(.+?)\*', r'\1', narasi)
        narasi = re.sub(r'^\s*[\*\-]\s+', '', narasi, flags=re.MULTILINE)
        narasi = re.sub(r'#+\s+', '', narasi)
        narasi = narasi.strip()

        return jsonify({"success": True, "narasi": narasi})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "message": str(e)}), 500


# JALANKAN FLASK
if __name__ == "__main__":
    app.run(port=5000, debug=False)