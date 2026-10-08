// Vercel serverless function: receives the form, validates it, saves it to Supabase (PostgreSQL).
// Keys come from Vercel Environment Variables, never hard-code them.

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

  const { SUPABASE_URL, SUPABASE_SERVICE_KEY } = process.env;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: "Server is not configured yet." });
  }

  try {
    const r = await fetch(`${SUPABASE_URL}/rest/v1/contacts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ name, email, phone: phone || null, subject, message })
    });
    if (!r.ok) {
      console.error("Supabase error:", r.status, await r.text());
      return res.status(502).json({ error: "Could not save your message. Please try again." });
    }
    return res.status(200).json({ ok: true });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Server error. Please try again." });
  }
};
