"use client";
import { motion } from "framer-motion";

const reviews = [
  {
    name: "Анна К.",
    text: "Очень довольна уборкой! Всё быстро, качественно и вежливо. Буду обращаться ещё!",
  },
  {
    name: "Игорь П.",
    text: "Профессиональный подход, чисто и аккуратно. Спасибо вашей команде!",
  },
  {
    name: "Мария С.",
    text: "Убрали квартиру после ремонта — идеально! Рекомендую!",
  },
];

export function Reviews() {
  return (
    <div className="flex flex-col gap-6">
      {reviews.map((review, i) => (
        <motion.div
          key={i}
          className="bg-white rounded shadow p-6 hover:shadow-lg transition-all cursor-pointer"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.03, y: -4 }}
          transition={{ duration: 0.5, delay: i * 0.12 }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <div className="font-semibold mb-2 text-blue-700">{review.name}</div>
          <div className="text-gray-700">{review.text}</div>
        </motion.div>
      ))}
    </div>
  );
} 