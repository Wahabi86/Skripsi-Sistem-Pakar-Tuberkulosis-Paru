import { RiLungsLine } from "react-icons/ri";
import { LuShieldCheck, LuClipboardPlus, LuHeartPulse } from "react-icons/lu";

const cards = [
  {
    icon: <RiLungsLine className="text-6xl text-[#277C78]" />,
    title: "Kenali Gejala",
    desc: "Kenali gejala Tuberkulosis Paru sejak awal sebelum bertambah parah.",
  },
  {
    icon: <LuShieldCheck className="text-6xl text-[#2F8F8B]" />,
    title: "Cegah Penularan",
    desc: "Deteksi dini membantu mencegah penularan ke orang terdekat.",
  },
  {
    icon: <LuClipboardPlus className="text-6xl text-[#2F8F8B]" />,
    title: "Tindakan Tepat",
    desc: "Semakin cepat diketahui, semakin besar peluang kesembuhan.",
  },
  {
    icon: <LuHeartPulse className="text-6xl text-[#2F8F8B]" />,
    title: "Lindungi Hidup",
    desc: "Jaga kesehatan paru demi hidup yang lebih sehat dan berkualitas.",
  },
];

export default function Home() {
  return (
    <div>
      {/* Section Deteksi Dini */}
      <section className="py-12 px-4 bg-white">
        {/* Judul */}
        <h2 className="text-center text-4xl font-bold text-gray-800 mb-3">Kenapa Deteksi Dini Itu Penting?</h2>

        {/* Garis biru pendek di bawah judul */}
        <div className="flex justify-center mb-8">
          <div className="w-12 h-1 bg-[#2F8F8B] rounded"></div>
        </div>

        {/* 4 Kartu */}
        <div className="flex flex-wrap justify-center gap-6">
          {cards.map((card, index) => (
            <div key={index} className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 w-72 flex flex-col items-center text-center">
              <div className="bg-[#EAF6F6] p-6 rounded-full mb-4">{card.icon}</div>
              <h3 className="font-bold text-gray-800 mb-2 text-lg">{card.title}</h3>
              <p className="text-gray-500 text-base">{card.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
