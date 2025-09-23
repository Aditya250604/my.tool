const FormData = require("form-data");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const { image } = req.body || {};
    if (!image) {
      return res.status(400).json({ ok: false, error: "No image provided" });
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const form = new FormData();
    form.append("chat_id", CHAT_ID);
    form.append("caption", "📸 Foto baru dari user");
    form.append("document", buffer, { filename: "snap.jpg" }); // <-- pakai document

    const tgRes = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
      { method: "POST", body: form, headers: form.getHeaders() }
    );

    const text = await tgRes.text();
    console.log("Telegram raw response:", text);

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return res.status(500).json({ ok: false, error: "Invalid JSON from Telegram", raw: text });
    }

    if (!data.ok) {
      return res.status(500).json({ ok: false, error: data.description });
    }

    return res.status(200).json({ ok: true, data });
  } catch (err) {
    console.error("SendPhoto error:", err);
    return res.status(500).json({ ok: false, error: err.message });
  }
};
