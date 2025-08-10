"use client"

import { useState } from "react";

const faqs = [
  {
    question: "Какие услуги клининга вы предоставляете?",
    answer: "Мы предлагаем полный спектр услуг: уборка квартир и офисов, химчистка мебели, дезинсекция, акарицидная обработка, дезинфекция помещений и покос травы. Все услуги выполняются профессионалами с использованием безопасных средств."
  },
  {
    question: "Безопасны ли ваши чистящие средства для детей и домашних животных?",
    answer: "Да, мы используем только экологически безопасные и сертифицированные средства, которые не представляют угрозы для здоровья детей и домашних животных."
  },
  {
    question: "Как часто нужно проводить дезинсекцию или акарицидную обработку?",
    answer: "Частота зависит от ситуации. Для профилактики мы рекомендуем проводить дезинсекцию 1-2 раза в год, а акарицидную обработку — весной или летом, особенно если вы живете рядом с зелеными зонами."
  },
  {
    question: "Могу ли я заказать уборку в день обращения?",
    answer: "Да, при наличии свободных специалистов мы можем организовать уборку в день обращения. Свяжитесь с нами для уточнения времени и деталей."
  },
  {
    question: "Что включает услуга химчистки мебели?",
    answer: "Химчистка мебели включает удаление пятен, пыли и загрязнений с мягкой мебели (диванов, кресел, матрасов) с использованием профессионального оборудования и безопасных химических средств."
  },
  {
    question: "Как подготовить помещение к дезинфекции?",
    answer: "Перед дезинфекцией уберите личные вещи, продукты питания и посуду в закрытые шкафы. Мы также рекомендуем временно вывести домашних животных из помещения."
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden">
          <button
            onClick={() => toggleAnswer(index)}
            className="w-full flex justify-between items-center p-6 text-left text-lg font-semibold text-blue-800 hover:bg-blue-50 transition-colors"
          >
            {faq.question}
            <span className={`transform transition-transform ${openIndex === index ? 'rotate-180' : ''}`}>▼</span>
          </button>
          <div
            className={`transition-max-height duration-300 ease-in-out overflow-hidden ${openIndex === index ? 'max-h-96' : 'max-h-0'}`}
          >
            <p className="p-6 pt-0 text-gray-600">{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}