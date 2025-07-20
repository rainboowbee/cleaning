"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import React from "react";

const serviceOptions = [
  "Клининг",
  "Химчистка мебели",
  "Дезинсекция",
  "Акарицидная обработка",
  "Дезинфекция",
  "Покос травы",
];

export default function CalcBlock() {
  const [step, setStep] = useState(0);
  const [serviceType, setServiceType] = useState("");
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [hasPets, setHasPets] = useState("");
  const [trashRemoval, setTrashRemoval] = useState("");
  const [comment, setComment] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Новые состояния для химчистки
  const [sofaCount, setSofaCount] = useState(0);
  const [chairCount, setChairCount] = useState(0);
  const [mattressCount, setMattressCount] = useState(0);
  // Для покоса и акарицидной — сотки
  const [sotka] = useState(0);

  const steps = [
    { label: "Тип услуги" },
    { label: "Площадь" },
    { label: "Комнаты" },
    { label: "Животные" },
    { label: "Вывоз мусора" },
    { label: "Комментарий" },
    { label: "Контакты" },
  ];

  // Контент шагов теперь функция
  function getStepContent() {
    switch (step) {
      case 0:
        return (
          <select
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
            className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
          >
            <option value="" disabled>Выберите услугу</option>
            {serviceOptions.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        );
      case 1:
        if (serviceType === "Клининг" || serviceType === "Акарицидная обработка" || serviceType === "Покос травы") {
          return (
            <input
              type="number"
              min={1}
              max={1000}
              value={area}
              onChange={e => setArea(e.target.value)}
              className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
              placeholder={serviceType === "Клининг" ? "Площадь помещения (кв.м)" : "Площадь участка (сотки)"}
            />
          );
        } else if (serviceType === "Химчистка мебели") {
          return (
            <React.Fragment>
              {[
                { label: "Диван", value: sofaCount, set: setSofaCount, min: 0, max: 10 },
                { label: "Стул", value: chairCount, set: setChairCount, min: 0, max: 20 },
                { label: "Матрас", value: mattressCount, set: setMattressCount, min: 0, max: 10 },
              ].map(({ label, value, set, min, max }) => (
                <div key={label} className="flex items-center gap-4">
                  <span>{label}:</span>
                  <input type="number" min={min} max={max} value={value} onChange={e => set(+e.target.value)} className="w-20 border rounded px-2 py-1" />
                </div>
              ))}
            </React.Fragment>
          );
        } else {
          return null;
        }
      case 2:
        return (
          <input
            type="number"
            min={1}
            max={20}
            value={rooms}
            onChange={e => setRooms(e.target.value)}
            className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
            placeholder="Количество комнат"
          />
        );
      case 3:
        return (
          <div className="flex gap-4">
            {["yes", "no"].map(val => (
              <button
                key={val}
                type="button"
                className={`px-6 py-3 rounded-xl border-2 text-lg font-medium transition ${hasPets === val ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"}`}
                onClick={() => setHasPets(val)}
              >
                {val === "yes" ? "Да" : "Нет"}
              </button>
            ))}
          </div>
        );
      case 4:
        return (
          <div className="flex gap-4">
            {["yes", "no"].map(val => (
              <button
                key={val}
                type="button"
                className={`px-6 py-3 rounded-xl border-2 text-lg font-medium transition ${trashRemoval === val ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"}`}
                onClick={() => setTrashRemoval(val)}
              >
                {val === "yes" ? "Да" : "Нет"}
              </button>
            ))}
          </div>
        );
      case 5:
        return (
          <textarea
            value={comment}
            onChange={e => setComment(e.target.value)}
            className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full min-h-[80px]"
            placeholder="Дополнительные пожелания или комментарии"
          />
        );
      case 6:
        return (
          <div className="flex flex-col gap-6">
            <input
              type="text"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
              placeholder="Ваше имя"
            />
            <input
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="border-2 border-blue-100 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
              placeholder="Телефон"
            />
          </div>
        );
      default:
        return null;
    }
  }

  // Валидация для кнопки Далее
  const canNext = [
    !!serviceType,
    !!area && +area > 0,
    !!rooms && +rooms > 0,
    hasPets === "yes" || hasPets === "no",
    trashRemoval === "yes" || trashRemoval === "no",
    true,
    true,
    !!contactName.trim() && /^\+?\d{10,15}$/.test(contactPhone),
  ];

  // Функция расчета стоимости
  function calcPrice() {
    if (serviceType === "Клининг") {
      const areaNum = +area || 0;
      const price = Math.max(areaNum * 120, 3000);
      return price;
    }
    if (serviceType === "Химчистка мебели") {
      let price = 0;
      if (sofaCount > 0) price += 3000 + (sofaCount - 1) * 2000;
      if (mattressCount > 0) price += 3000 + (mattressCount - 1) * 2000;
      price += chairCount * 350;
      return Math.max(price, 3000);
    }
    if (serviceType === "Акарицидная обработка") {
      const s = +sotka || 0;
      let price = 0;
      if (s >= 12) price = s * 400;
      else if (s >= 7) price = s * 450;
      else price = s * 500;
      return Math.max(price, 3000);
    }
    if (serviceType === "Дезинсекция") {
      const r = +rooms || 0;
      let price = 0;
      if (r > 0) price = 3000 + (r - 1) * 1000;
      return Math.max(price, 3000);
    }
    if (serviceType === "Покос травы") {
      const s = +sotka || 0;
      let price = 0;
      if (s >= 50) price = s * 400;
      else if (s > 10) price = s * 450;
      else price = s * 500;
      return Math.max(price, 3000);
    }
    // Дезинфекция — минимум 3000
    if (serviceType === "Дезинфекция") return 3000;
    return 0;
  }

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: contactName,
          phone: contactPhone,
          contactType: "PHONE",
          calcData: {
            serviceType,
            area: area ? +area : undefined,
            rooms: rooms ? +rooms : undefined,
            hasPets: hasPets === "yes",
            trashRemoval: trashRemoval === "yes",
            comment,
          },
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        // setError(data.error || "Ошибка отправки"); // This line was removed as per the edit hint
      }
    } catch {
      // setError("Ошибка сети"); // This line was removed as per the edit hint
    }
    setLoading(false);
  };

  if (step === steps.length - 1 && submitted) {
    return (
      <div className="max-w-[96vw] w-[1400px] min-h-[600px] mx-auto my-12 bg-white rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden" style={{ minWidth: 900 }}>
        <div className="hidden md:flex flex-col w-1/3 bg-blue-50 py-16 px-10">
          <h3 className="text-2xl font-bold mb-12 text-blue-700">Заявка</h3>
          <ol className="space-y-8">
            {steps.map((s, i) => (
              <li key={s.label || i} className="flex items-center gap-4 min-h-[56px]">
                <span className={`w-12 h-12 flex items-center justify-center rounded-full border-2 text-xl font-bold ${i < step ? 'bg-blue-600 border-blue-600 text-white' : i === step ? 'bg-white border-blue-600 text-blue-700' : 'bg-white border-blue-200 text-blue-300'}`}
                  style={{ minWidth: 48, minHeight: 48, lineHeight: '48px', textAlign: 'center' }}
                >{i+1}</span>
                <span className={`font-semibold leading-tight break-words ${i === step ? 'text-blue-700' : 'text-blue-400'}`}>{s.label}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="flex-1 p-16 flex flex-col items-center justify-center">
          <div className="max-w-2xl w-full mx-auto min-h-[196px] flex flex-col items-center justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="w-full flex flex-col items-center"
            >
              <h2 className="text-3xl font-bold mb-6 text-blue-700 text-center">Спасибо!</h2>
              <p className="text-lg text-blue-700 text-center">Данные калькулятора заполнены.</p>
              <button
                className="mt-8 px-8 py-4 rounded-xl border-2 text-xl font-medium transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
                onClick={() => { setStep(0); setServiceType(""); setArea(""); setRooms(""); setHasPets(""); setTrashRemoval(""); setComment(""); setContactName(""); setContactPhone(""); setSubmitted(false); }}
              >
                Заполнить ещё раз
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      {/* Прогресс-бар этапов */}
      <div className="w-full max-w-2xl flex flex-col items-center mb-8">
        <div className="relative w-full flex items-center justify-between" style={{ height: 32 }}>
          {/* Пунктирная линия */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-0.5 z-0" style={{ borderTop: '2px dashed #bbb' }} />
          {/* Точки этапов */}
          {steps.map((s, i) => (
            <div key={s.label || i} className="relative z-10 flex flex-col items-center" style={{ width: 1, flex: 1 }}>
              <span
                className={`w-5 h-5 rounded-full border-2 ${i === step ? 'bg-blue-600 border-blue-600' : 'bg-gray-300 border-gray-400'} transition-all duration-200`}
                style={{ display: 'inline-block' }}
              />
            </div>
          ))}
        </div>
      </div>
      {/* Блок этапа */}
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-lg p-8 mb-8">
        <div className="text-2xl font-semibold mb-4 text-gray-900">{steps[step].label}</div>
        <div className="min-h-[120px] flex items-start">{getStepContent()}</div>
        {/* Кнопки управления шагами */}
        <div className="flex flex-row justify-between gap-4 mt-8">
          <button
            type="button"
            className="px-8 py-3 rounded-xl border-2 text-xl font-medium transition bg-white border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 shadow-sm"
            onClick={() => setStep(s => s - 1)}
            disabled={step === 0}
          >
            Назад
          </button>
          {step === steps.length - 1 ? (
            <button
              type="button"
              className="px-8 py-3 rounded-xl border-2 text-xl font-medium transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 shadow-lg"
              onClick={handleSubmit}
              disabled={!canNext[step] || loading}
            >
              {loading ? "Отправка..." : "Завершить"}
            </button>
          ) : (
            <button
              type="button"
              className="px-8 py-3 rounded-xl border-2 text-xl font-medium transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 shadow-lg"
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext[step]}
            >
              Далее
            </button>
          )}
        </div>
      </div>
      {/* Итоговая стоимость */}
      <div className="text-xl font-semibold text-blue-600 mt-2">итоговая стоимость от {calcPrice().toLocaleString()}р</div>
    </div>
  );
} 