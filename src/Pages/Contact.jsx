/* eslint-disable no-unused-vars */
import React, { useState } from "react";

const Contact = () => {
  const [form, setForm] = useState({
    nom: "",
    email: "",
    phone: "",
    sujet: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", msg: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.nom || !form.email || !form.message) {
      setStatus({
        type: "error",
        msg: "Veuillez remplir au minimum Nom, Email et Message.",
      });
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await fetch("https://formspree.io/f/xgvneapy", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          _replyto: form.email,
          _subject: form.sujet
            ? `[Contact VNOVA] ${form.sujet}`
            : "[Contact VNOVA] Nouveau message",
          nom: form.nom,
          email: form.email,
          telephone: form.phone || "",
          sujet: form.sujet || "",
          message: form.message,
          _next: "https://vnova.tn/merci",
        }),
      });

      if (response.ok) {
        setStatus({ type: "ok", msg: "Message envoyé avec succès✅" });
        setForm({ nom: "", email: "", phone: "", sujet: "", message: "" });
      } else {
        throw new Error("Erreur lors de l'envoi");
      }
    } catch (error) {
      const subject = form.sujet
        ? `[Contact VNOVA] ${form.sujet}`
        : "[Contact VNOVA] Nouveau message";
      const body = `Bonjour,

Vous avez reçu un nouveau message de contact depuis le site VNOVA :

Nom : ${form.nom}
Email : ${form.email}
${form.phone ? `Téléphone : ${form.phone}` : ""}
${form.sujet ? `Sujet : ${form.sujet}` : ""}

Message :
${form.message}

---
Message envoyé depuis le site web VNOVA
Date : ${new Date().toLocaleString("fr-FR")}`;

      const encodedSubject = encodeURIComponent(subject);
      const encodedBody = encodeURIComponent(body);
      window.location.href = `mailto:helpdesk@vnova.net?subject=${encodedSubject}&body=${encodedBody}`;

      setStatus({
        type: "ok",
        msg: "Votre client email s'ouvre pour envoyer le message à helpdesk@vnova.net ✅",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="contact-skin contact-skin-dark min-h-[90vh] relative overflow-hidden has-divider">
      <div className="pointer-events-none absolute -left-24 top-1/3 w-72 h-72 rounded-full bg-[#aacbda]/30 blur-3xl" />
      <div className="pointer-events-none absolute -right-32 -top-20 w-[36rem] h-[36rem] rounded-full bg-[#aacbda]/20 blur-[90px]" />

      <div className="relative max-w-6xl mx-auto px-5 lg:px-8 py-12 lg:py-16">
        <div className="contact-stack">
          <aside className="panel infos-panel contact-card h-full">
            <div className="flex items-center justify-between">
              <h2 className="m-0 text-white font-extrabold text-xl">Contactez-nous</h2>
            </div>

            <p className="mt-1 text-white/80">
              Une question sur nos produits ou un partenariat? Notre équipe vous
              répond rapidement.
            </p>

            <hr className="opacity-20 my-1" />

            <ul className="mt-2">
              <li>
                {/* Icône ADRESSE */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 1 1 18 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
                <div>
                  <strong>Adresse</strong>
                  <div>Cité el Mallab, Route Akouda</div>
                </div>
              </li>

              <li>
                {/* Icône EMAIL */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                  <path d="M3 7l9 7 9-7" />
                </svg>
                <div>
                  <strong>Email</strong>
                  <div><a href="mailto:helpdesk@vnova.net" className="hover:underline">helpdesk@vnova.net</a></div>
                </div>
              </li>

              <li>
                {/* Icône TÉLÉPHONE */}
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true"
                  strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 6a3 3 0 0 1 3 3" />
                  <path d="M15 3a6 6 0 0 1 6 6" />
                  <path d="M22 16.92v2a2 2 0 0 1-2.18 2
                           19.77 19.77 0 0 1-8.63-3.07
                           19.5 19.5 0 0 1-6-6
                           19.77 19.77 0 0 1-3.07-8.63
                           A2 2 0 0 1 4.11 1h2a2 2 0 0 1 2 1.72
                           c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L7 8.5
                           a16 16 0 0 0 6 6l1.05-1.28
                           a2 2 0 0 1 2.11-.45
                           c.85.29 1.73.5 2.63.62
                           A2 2 0 0 1 22 16.92Z" />
                </svg>
                <div>
                  <strong>Téléphone</strong>
                  <div><a href="tel:+216 96 355 405" className="hover:underline">+216 96 355 405</a></div>
                </div>
              </li>
            </ul>
            
            <div className=" mt-4 grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-white/10 text-white/90 p-3">
              
                <div className="opacity-80">Lun–Ven</div>
                <div className="font-semibold">8:00 – 17:00</div>
              </div>
              <div className="rounded-lg bg-white/10 text-white/90 p-3">
                <div className="opacity-80">Samedi</div>
                <div className="font-semibold">8:00 – 14:00</div>
              </div>
            </div>
          </aside>

          {/* Formulaire */}
          <section  className="panel form-panel contact-card h-full">
            <h2>Envoyer un message</h2>

            <form onSubmit={handleSubmit} noValidate>
              <div className="field">
                <label htmlFor="nom">Nom</label>
                <input
                  id="nom" name="nom" value={form.nom} onChange={handleChange}
                  placeholder="Votre nom complet" required
                  aria-invalid={!form.nom && status.type === "error"}
                  className={!form.nom && status.type === "error" ? "is-invalid" : ""}
                />
              </div>

              <div className="field">
                <label htmlFor="email">Email</label>
                <input
                  id="email" name="email" type="email"
                  value={form.email} onChange={handleChange}
                  placeholder="vous@exemple.com" required
                  aria-invalid={!form.email && status.type === "error"}
                  className={!form.email && status.type === "error" ? "is-invalid" : ""}
                />
              </div>

              <div className="field">
                <label htmlFor="phone">Téléphone</label>
                <input
                  id="phone" name="phone" value={form.phone}
                  onChange={handleChange} placeholder="+216 …"
                />
              </div>

              <div className="field">
                <label htmlFor="sujet">Sujet</label>
                <input
                  id="sujet" name="sujet" value={form.sujet}
                  onChange={handleChange} placeholder="Sujet de votre message"
                />
              </div>

              <div className="field">
                <label htmlFor="message">Message</label>
                <textarea
                  id="message" name="message" rows={5}
                  value={form.message} onChange={handleChange}
                  placeholder="Comment pouvons-nous vous aider ?"
                  aria-invalid={!form.message && status.type === "error"}
                  className={!form.message && status.type === "error" ? "is-invalid" : ""}
                />
              </div>

              {status.msg && (
                <div
                  role="status"
                  className={`mt-1 text-sm ${
                    status.type === "ok" ? "text-[#2d7a62]" : "text-[#c25252]"
                  }`}
                >
                  {status.msg}
                </div>
              )}

              <button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
                aria-busy={isSubmitting}
              >
                {isSubmitting ? "Envoi..." : "Envoyer"}
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Contact;
