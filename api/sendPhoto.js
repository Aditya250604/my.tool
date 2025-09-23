import FormData from "form-data";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { image } = req.body;
    if (!image) {
      return res.status(400).json({ ok: false, error: "No image provided" });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    // Konversi base64 ke buffer
    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    // Buat form-data untuk upload file
    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("caption", "📸 Foto baru dari user");
    form.append("photo", buffer, { filename: "snap.jpg" });

    // Kirim ke Telegram
    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        body: form,
        headers: form.getHeaders(),
      }
    );

    const data = await tgRes.json();
    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
