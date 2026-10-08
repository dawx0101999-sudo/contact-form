(() => {
  const form = document.getElementById("contactForm");
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("status");
  const message = document.getElementById("message");
  const count = document.getElementById("count");

  const rules = {
    name: v => v.trim().length >= 2 || "Enter your full name (at least 2 characters).",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter a valid email, like name@example.com.",
    phone: v => v.trim() === "" || /^[+]?[\d\s-]{7,15}$/.test(v.trim()) || "Enter 7–15 digits, or leave this blank.",
    subject: v => v !== "" || "Choose a topic.",
    message: v => v.trim().length >= 10 || "Write at least 10 characters."
  };

  function validateField(el) {
    const rule = rules[el.name];
    if (!rule) return true;
    const result = rule(el.value);
    const field = el.closest(".field");
    const err = field.querySelector(".error");
    const ok = result === true;
    field.classList.toggle("invalid", !ok);
    err.textContent = ok ? "" : result;
    el.setAttribute("aria-invalid", String(!ok));
    return ok;
  }

  Object.keys(rules).forEach(name => {
    const el = form.elements[name];
    el.addEventListener("blur", () => validateField(el));
    el.addEventListener("input", () => { if (el.closest(".field").classList.contains("invalid")) validateField(el); });
  });

  message.addEventListener("input", () => { count.textContent = `${message.value.length} / 1000`; });

  function setStatus(text, type) {
    status.textContent = text;
    status.className = type || "";
  }

  form.addEventListener("submit", async e => {
    e.preventDefault();
    setStatus("");

    const valid = Object.keys(rules).map(n => validateField(form.elements[n])).every(Boolean);
    if (!valid) {
      const firstBad = form.querySelector(".invalid input, .invalid select, .invalid textarea");
      if (firstBad) firstBad.focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form).entries());
    btn.disabled = true;
    btn.classList.add("loading");
    btn.querySelector(".label").textContent = "Sending";

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body.error || "Something went wrong. Please try again.");

      form.reset();
      count.textContent = "0 / 1000";
      setStatus("Message sent. Thank you, we'll be in touch soon.", "ok");
    } catch (err) {
      setStatus(err.message, "fail");
    } finally {
      btn.disabled = false;
      btn.classList.remove("loading");
      btn.querySelector(".label").textContent = "Send message";
    }
  });
})();
