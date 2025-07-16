"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const contactOptions = [
  { value: "PHONE", label: "Телефон" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "TELEGRAM", label: "Telegram" },
];

export function LeadForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [contactType, setContactType] = useState("PHONE");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    if (!name.trim() || !phone.trim()) {
      setError("Пожалуйста, заполните все поля");
      return;
    }
    if (!/^\+?\d{10,15}$/.test(phone)) {
      setError("Введите корректный номер телефона");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, phone, contactType }),
    });
    setLoading(false);
    if (res.ok) {
      setSuccess(true);
      setName("");
      setPhone("");
      setContactType("PHONE");
    } else {
      const data = await res.json();
      setError(data.error || "Ошибка отправки");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl border-4 border-transparent bg-clip-padding relative overflow-hidden group"
      style={{ boxShadow: "0 8px 32px 0 rgba(0,0,0,0.10)" }}
    >
      <div className="absolute inset-0 pointer-events-none rounded-3xl border-2 border-transparent group-focus-within:border-blue-400 group-hover:border-blue-300 transition-all duration-300" style={{background: "linear-gradient(135deg, #60a5fa33 0%, #a7f3d033 100%)"}} />
      <AnimatePresence>
        {success && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.7 }}
            className="absolute inset-0 flex flex-col items-center justify-center bg-white/90 z-10 rounded-3xl"
          >
            <motion.svg
              width="64"
              height="64"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mb-2"
            >
              <circle cx="32" cy="32" r="30" stroke="#22c55e" strokeWidth="4" fill="#e0fbe6" />
              <motion.path
                d="M20 34L30 44L46 26"
                stroke="#22c55e"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
              />
            </motion.svg>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="text-green-600 text-lg font-semibold"
            >
              Заявка отправлена!
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <input
        type="text"
        placeholder="Имя"
        value={name}
        onChange={e => setName(e.target.value)}
        className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg placeholder-gray-400"
        required
        disabled={success}
      />
      <input
        type="tel"
        placeholder="Телефон"
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg placeholder-gray-400"
        required
        disabled={success}
      />
      <select
        value={contactType}
        onChange={e => setContactType(e.target.value)}
        className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg"
        disabled={success}
      >
        {contactOptions.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <div className="text-red-500 text-sm font-medium text-center">{error}</div>}
      <button
        type="submit"
        className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-3 rounded-xl font-semibold text-lg shadow-md hover:from-blue-600 hover:to-blue-800 transition disabled:opacity-50 mt-2"
        disabled={loading || success}
      >
        {loading ? (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2"
          >
            <svg className="animate-spin mr-2" width="20" height="20" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fff" strokeWidth="4" fill="none" opacity="0.3"/><path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="4" fill="none"/></svg>
            Отправка...
          </motion.span>
        ) : (
          "Отправить заявку"
        )}
      </button>
    </form>
  );
} 