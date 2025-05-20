const { createClient } = require("@supabase/supabase-js");

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

module.exports = async (req, res) => {
  // ✅ Tambahkan headers CORS
const allowedOrigins = ["https://stemation-student.vercel.app"];
const origin = req.headers.origin;
if (allowedOrigins.includes(origin)) {
  res.setHeader("Access-Control-Allow-Origin", origin);
}

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    // Untuk menangani preflight request
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { nama, absen, score } = req.body;

  if (!nama || absen === undefined || score === undefined) {
    return res.status(400).json({ error: "Data tidak lengkap" });
  }

  const { data, error } = await supabase
    .from("submissions")
    .insert([{ nama, absen, score }])
    .select()
    .single();

  if (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json({ message: "Berhasil tersimpan", data });
};
