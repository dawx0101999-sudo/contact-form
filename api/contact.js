// Vercel serverless function: validates the form and saves it to Neon (PostgreSQL).
const { neon } = require("@neondatabase/serverless");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const b = req.body || {};

  // Bots fill the hidden field; pretend success and drop it.
  if (b.website) return res.status(200).json({ ok: true });

  const name = String(b.name || "").trim();
  const email = String(b.email || "").trim();
  const phone = String(b.phone || "").trim();
  const subject = String(b.subject || "").trim();
  const message = String(b.message || "").trim();

  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: "Please enter a valid name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return res.status(400).json({ error: "Please enter a valid email." });
  if (phone && !/^[+]?[\d\s-]{7,15}$/.test(phone)) return res.status(400).json({ error: "Please enter a valid phone number." });
  if (!subject) return res.status(400).json({ error: "Please choose a subject." });
  if (message.length < 10 || message.length > 1000) return res.status(400).json({ error: "Message must be 10 to 1000 characters." });

  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "Database is not configured yet." });
  }

  try {
    const sql = neon(process.env.DATABASE_URL);
    await sql`
      INSERT INTO contacts (name, email, phone, subject, message)
      VALUES (${name}, ${email}, ${phone || null}, ${subject}, ${message})
    `;
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error("Database error:", e);
    return res.status(500).json({ error: "Could not save your message. Please try again." });
  }
};