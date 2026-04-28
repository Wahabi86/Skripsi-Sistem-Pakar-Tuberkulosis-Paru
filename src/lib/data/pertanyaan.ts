export type Option = {
  label: string;
};

export type Question = {
  id: string;
  question: string;
  options: Option[];
};

export const questions: Question[] = [
  {
    id: "G1",
    question: "Sudah berapa lama Anda mengalami batuk?",
    options: [{ label: "Sudah lebih dari 2 minggu dan masih berlanjut" }, { label: "Sudah sekitar 2 minggu" }, { label: "Kurang dari 2 minggu" }, { label: "Tidak sedang batuk" }],
  },
  {
    id: "G2",
    question: "Saat batuk, apakah disertai dahak?",
    options: [{ label: "Ya, selalu keluar dahak setiap batuk" }, { label: "Kadang-kadang ada dahak, tidak setiap batuk" }, { label: "Jarang, dahaknya sedikit" }, { label: "Tidak ada dahak sama sekali" }],
  },
  {
    id: "G3",
    question: "Apakah Anda pernah batuk disertai darah?",
    options: [{ label: "Ya, darah keluar setiap kali batuk" }, { label: "Ya, sudah beberapa kali terjadi" }, { label: "Pernah sekali, dahak berwarna kemerahan" }, { label: "Tidak pernah" }],
  },
  {
    id: "G4",
    question: "Apakah Anda merasakan nyeri atau ketidaknyamanan di area dada?",
    options: [
      { label: "Ya, nyeri dada terasa terus-menerus bahkan saat istirahat" },
      { label: "Ya, nyeri muncul terutama saat batuk atau bernapas dalam" },
      { label: "Ada rasa tidak nyaman di dada, tapi tidak sampai nyeri" },
      { label: "Tidak ada nyeri dada sama sekali" },
    ],
  },
  {
    id: "G5",
    question: "Apakah Anda mengalami sesak napas?",
    options: [{ label: "Ya, sesak napas bahkan saat istirahat" }, { label: "Ya, sesak muncul saat aktivitas ringan" }, { label: "Sesak hanya muncul saat aktivitas berat" }, { label: "Tidak mengalami sesak napas" }],
  },
  {
    id: "G6",
    question: "Apakah Anda sering merasa lemas, lesu, atau tidak bertenaga tanpa sebab yang jelas?",
    options: [
      { label: "Ya, hampir setiap hari terasa sangat lemas hingga sulit beraktivitas" },
      { label: "Ya, sering merasa lemas meski tidak banyak beraktivitas" },
      { label: "Kadang-kadang merasa lemas, tidak menentu" },
      { label: "Tidak, kondisi tubuh normal dan bertenaga" },
    ],
  },
  {
    id: "G7",
    question: "Apakah berat badan Anda menurun dalam beberapa waktu terakhir tanpa alasan yang jelas?",
    options: [{ label: "Ya, berat badan turun cukup signifikan belakangan ini" }, { label: "Sedikit berkurang, tapi tidak terlalu terasa" }, { label: "Tidak ada penurunan berat badan" }],
  },
  {
    id: "G8",
    question: "Apakah nafsu makan Anda berkurang belakangan ini?",
    options: [{ label: "Ya, hampir tidak mau makan sama sekali" }, { label: "Ya, porsi makan berkurang dari biasanya" }, { label: "Kadang tidak nafsu makan, tidak setiap hari" }, { label: "Nafsu makan normal seperti biasa" }],
  },
  {
    id: "G9",
    question: "Apakah Anda mengalami demam belakangan ini?",
    options: [{ label: "Ya, demam tinggi yang berlangsung terus-menerus" }, { label: "Ya, demam ringan yang hilang timbul" }, { label: "Kadang-kadang merasa hangat, tidak pasti demam" }, { label: "Tidak ada demam" }],
  },
  {
    id: "G10",
    question: "Apakah Anda sering berkeringat di malam hari meski tidak kepanasan?",
    options: [{ label: "Ya, hampir setiap malam berkeringat banyak meski tidak kepanasan" }, { label: "Ya, beberapa kali dalam seminggu" }, { label: "Pernah terjadi, tapi jarang" }, { label: "Tidak pernah" }],
  },
];
