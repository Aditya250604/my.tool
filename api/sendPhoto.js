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

    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          photo: image,
          caption: "📸 Foto baru dari user",
        }),
      }
    );

    let data;
    try {
      data = await tgRes.json(); // amanin parsing JSON
    } catch (e) {
      return res.status(500).json({ ok: false, error: "Invalid response from Telegram" });
    }

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
