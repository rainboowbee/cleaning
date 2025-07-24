"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import React, { useRef, useLayoutEffect } from "react";

const serviceOptions = [
  { value: "Клининг", label: "Клининг" },
  { value: "Химчистка мебели", label: "Химчистка мебели" },
  { value: "Дезинсекция", label: "Дезинсекция" },
  { value: "Акарицидная обработка", label: "Акарицидная обработка" },
  { value: "Дезинфекция", label: "Дезинфекция" },
  { value: "Покос травы", label: "Покос травы" },
];

// Конфиг шагов для каждой услуги
type StepConfig = { key: string; label: string; type: string; min?: number; max?: number; required?: boolean };
type ServiceStepsMap = { [key: string]: StepConfig[] };
const serviceSteps: ServiceStepsMap = {
  "Клининг": [
    { key: "area", label: "Площадь помещения (кв.м)", type: "number", min: 1, max: 1000, required: true },
    { key: "rooms", label: "Количество комнат", type: "number", min: 1, max: 20, required: true },
    { key: "hasPets", label: "Есть ли животные?", type: "boolean", required: true },
    { key: "trashRemoval", label: "Вывоз мусора?", type: "boolean", required: true },
    { key: "comment", label: "Комментарий", type: "text", required: false },
    { key: "contacts", label: "Контакты", type: "contacts", required: true },
  ],
  "Химчистка мебели": [
    { key: "furniture", label: "Добавьте мебель", type: "custom", required: true },
    { key: "comment", label: "Комментарий", type: "text", required: false },
    { key: "contacts", label: "Контакты", type: "contacts", required: true },
  ],
  "Покос травы": [
    { key: "area", label: "Площадь участка (сотки)", type: "number", min: 1, max: 1000, required: true },
    { key: "trashRemoval", label: "Вывоз мусора?", type: "boolean", required: true },
    { key: "comment", label: "Комментарий", type: "text", required: false },
    { key: "contacts", label: "Контакты", type: "contacts", required: true },
  ],
  "Дезинсекция": [
    { key: "rooms", label: "Количество комнат", type: "number", min: 1, max: 20, required: true },
    { key: "comment", label: "Комментарий", type: "text", required: false },
    { key: "contacts", label: "Контакты", type: "contacts", required: true },
  ],
  "Акарицидная обработка": [
    { key: "area", label: "Площадь участка (сотки)", type: "number", min: 1, max: 1000, required: true },
    { key: "comment", label: "Комментарий", type: "text", required: false },
    { key: "contacts", label: "Контакты", type: "contacts", required: true },
  ],
  "Дезинфекция": [
    { key: "comment", label: "Комментарий", type: "text", required: false },
    { key: "contacts", label: "Контакты", type: "contacts", required: true },
  ],
};

type FurnitureItem = { name: string; count: number };

export default function CalcBlock() {
  // Состояния для всех возможных полей
  const [serviceType, setServiceType] = useState("");
  const [step, setStep] = useState(0);
  const [area, setArea] = useState("");
  const [rooms, setRooms] = useState("");
  const [hasPets, setHasPets] = useState("");
  const [trashRemoval, setTrashRemoval] = useState("");
  const [comment, setComment] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [sofaCount, setSofaCount] = useState(0);
  const [chairCount, setChairCount] = useState(0);
  const [mattressCount, setMattressCount] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Для химчистки мебели: массив мебели
  const [furniture, setFurniture] = useState<FurnitureItem[]>([]);
  const [furnitureName, setFurnitureName] = useState("");
  const [furnitureCount, setFurnitureCount] = useState("");

  // --- Animated block size logic ---
  const contentRef = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => {
    if (contentRef.current) {
      // setBoxHeight(contentRef.current.offsetHeight); // This line was removed
    }
  }, [step, serviceType, area, rooms, hasPets, trashRemoval, comment, contactName, contactPhone, sofaCount, chairCount, mattressCount, furniture]);

  // Получаем массив шагов для выбранной услуги
  const steps: StepConfig[] = serviceType ? serviceSteps[serviceType] : [];

  // Сброс всех полей
  function resetAll() {
    setStep(0);
    setServiceType("");
    setArea("");
    setRooms("");
    setHasPets("");
    setTrashRemoval("");
    setComment("");
    setContactName("");
    setContactPhone("");
    setSofaCount(0);
    setChairCount(0);
    setMattressCount(0);
    setSubmitted(false);
    setError("");
    setFurniture([]);
    setFurnitureName("");
    setFurnitureCount("");
  }

  // Валидация текущего шага
  function isStepValid() {
    if (!serviceType) return false;
    if (step === 0) return true;
    const s = steps[step - 1];
    if (!s) return true;
    if (serviceType === "Химчистка мебели" && s.key === "furniture") {
      return furniture.length > 0;
    }
    switch (s.key) {
      case "area": return !!area && +area >= (s.min || 1);
      case "rooms": return !!rooms && +rooms >= (s.min || 1);
      case "hasPets": return hasPets === "yes" || hasPets === "no";
      case "trashRemoval": return trashRemoval === "yes" || trashRemoval === "no";
      case "sofaCount":
      case "chairCount":
      case "mattressCount": return true; // не обязательные
      case "contacts": return !!contactName.trim() && /^\+?\d{10,15}$/.test(contactPhone);
      default: return true;
    }
  }

  // Контент шага
  function getStepContent() {
    if (step === 0) {
      return (
        <motion.div key="serviceType" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }} className="w-full">
          <select
            value={serviceType}
            onChange={e => { setServiceType(e.target.value); setStep(1); }}
            className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
          >
            <option value="" disabled>Выберите услугу</option>
            {serviceOptions.map((opt: { value: string; label: string }) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </motion.div>
      );
    }
    const s = steps[step - 1];
    if (!s) return null;
    // Кастомный шаг для химчистки мебели
    if (serviceType === "Химчистка мебели" && s.key === "furniture") {
      return (
        <motion.div key="furniture-step" initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="w-full flex flex-col gap-4 items-center">
          <div className="flex flex-wrap gap-3 mb-2 w-full justify-center">
            {furniture.map((item: FurnitureItem) => (
              <div key={item.name + item.count} className="flex items-center bg-blue-100 text-blue-800 rounded-xl px-4 py-2 font-semibold text-base shadow-sm gap-2">
                {item.name} {item.count} шт
                <button
                  type="button"
                  className="ml-2 text-blue-400 hover:text-red-500 text-lg font-bold"
                  onClick={() => setFurniture(furniture.filter((f) => !(f.name === item.name && f.count === item.count)))}
                  aria-label="Удалить"
                >×</button>
              </div>
            ))}
          </div>
          <div className="flex gap-2 w-full max-w-md mb-2">
            <input
              type="text"
              value={furnitureName}
              onChange={e => setFurnitureName(e.target.value)}
              className="flex-1 border-2 border-blue-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-base"
              placeholder="Введите название мебели"
              disabled={furniture.length >= 10}
            />
            <input
              type="number"
              min={1}
              max={99}
              value={furnitureCount}
              onChange={e => setFurnitureCount(e.target.value.replace(/[^\d]/g, ""))}
              className="w-28 border-2 border-blue-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-base"
              placeholder="Количество"
              disabled={furniture.length >= 10}
            />
          </div>
          <button
            type="button"
            className="w-full max-w-md bg-blue-200 text-blue-700 font-semibold rounded-xl py-2 px-6 text-lg shadow hover:bg-blue-300 transition disabled:opacity-50"
            onClick={() => {
              if (furnitureName.trim() && +furnitureCount > 0) {
                setFurniture([...furniture, { name: furnitureName.trim(), count: +furnitureCount }]);
                setFurnitureName("");
                setFurnitureCount("");
              }
            }}
            disabled={!furnitureName.trim() || !furnitureCount || +furnitureCount <= 0 || furniture.length >= 10}
          >
            Добавить
          </button>
        </motion.div>
      );
    }
    switch (s.type) {
      case "number": {
        let val: string | number;
        let setVal: ((v: string) => void) | ((v: number) => void);
        if (s.key === "area") { val = area; setVal = setArea; }
        else if (s.key === "rooms") { val = rooms; setVal = setRooms; }
        else if (s.key === "sofaCount") { val = sofaCount; setVal = (v: number) => setSofaCount(v); }
        else if (s.key === "chairCount") { val = chairCount; setVal = (v: number) => setChairCount(v); }
        else { val = mattressCount; setVal = (v: number) => setMattressCount(v); }
        return (
          <motion.div key={s.key} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="w-full flex flex-col gap-2">
            <label className="text-lg font-medium text-blue-900 mb-2">{s.label}</label>
            <input
              type="number"
              min={s.min}
              max={s.max}
              value={val}
              onChange={e => {
                if (s.key === "area" || s.key === "rooms") (setVal as (v: string) => void)(e.target.value.replace(/[^\d]/g, ""));
                else (setVal as (v: number) => void)(Math.max(s.min ?? 0, Math.min(s.max ?? 1000, +e.target.value || 0)));
              }}
              className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
              placeholder={s.label}
            />
          </motion.div>
        );
      }
      case "boolean":
        const boolVal = s.key === "hasPets" ? hasPets : trashRemoval;
        const setBoolVal = s.key === "hasPets" ? setHasPets : setTrashRemoval;
        return (
          <motion.div key={s.key} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex gap-4">
            {["yes", "no"].map(val => (
              <button
                key={val}
                type="button"
                className={`px-6 py-3 rounded-xl border-2 text-lg font-medium transition ${boolVal === val ? "bg-blue-600 text-white border-blue-600" : "bg-white border-blue-200 text-blue-700 hover:bg-blue-50"}`}
                onClick={() => setBoolVal(val)}
              >
                {val === "yes" ? "Да" : "Нет"}
              </button>
            ))}
          </motion.div>
        );
      case "text":
        return (
          <motion.div key={s.key} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="w-full">
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value)}
              className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full min-h-[80px]"
              placeholder={s.label + (s.required ? "" : " (необязательно)")}
            />
          </motion.div>
        );
      case "contacts":
        return (
          <motion.div key={s.key} initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -40 }} transition={{ duration: 0.3 }} className="flex flex-col gap-6 w-full">
            <input
              type="text"
              value={contactName}
              onChange={e => setContactName(e.target.value)}
              className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
              placeholder="Ваше имя"
              required
            />
            <input
              type="tel"
              value={contactPhone}
              onChange={e => setContactPhone(e.target.value)}
              className="border-2 border-blue-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 transition bg-white/90 shadow-sm text-lg w-full"
              placeholder="Телефон"
              required
            />
            {error && <div className="text-red-500 text-sm font-medium text-center mt-2">{error}</div>}
          </motion.div>
        );
      default:
        return null;
    }
  }

  // Функция расчета стоимости (оставляю без изменений)
  function calcPrice() {
    if (serviceType === "Клининг") {
      const areaNum = +area || 0;
      const price = Math.max(areaNum * 120, 3000);
      return price;
    }
    if (serviceType === "Химчистка мебели") {
      let price = 0;
      for (const item of furniture) {
        if (/диван/i.test(item.name)) price += 3000 + (item.count - 1) * 2000;
        else if (/матрас/i.test(item.name)) price += 3000 + (item.count - 1) * 2000;
        else price += item.count * 350;
      }
      return Math.max(price, 3000);
    }
    if (serviceType === "Акарицидная обработка") {
      const s = +area || 0;
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
      const s = +area || 0;
      let price = 0;
      if (s >= 50) price = s * 400;
      else if (s > 10) price = s * 450;
      else price = s * 500;
      return Math.max(price, 3000);
    }
    if (serviceType === "Дезинфекция") return 3000;
    return 0;
  }

  // Отправка
  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    if (!/^\+?\d{10,15}$/.test(contactPhone)) {
      setError("Введите корректный номер телефона");
      setLoading(false);
      return;
    }
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
            hasPets: hasPets === "yes" ? true : hasPets === "no" ? false : undefined,
            trashRemoval: trashRemoval === "yes" ? true : trashRemoval === "no" ? false : undefined,
            comment,
            furniture: serviceType === "Химчистка мебели" ? furniture : undefined,
          },
        }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        setError("Ошибка отправки. Попробуйте позже.");
      }
    } catch {
      setError("Ошибка сети. Попробуйте позже.");
    }
    setLoading(false);
  };

  // Анимация успешной отправки
  if (serviceType && step === steps.length && submitted) {
    return (
      <div className="max-w-[96vw] w-full md:w-[900px] min-h-[500px] mx-auto my-12 bg-white rounded-3xl shadow-2xl flex flex-col items-center justify-center overflow-hidden p-8">
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <motion.svg
              width="80"
              height="80"
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: [0, 10, -10, 0] }}
              transition={{ type: "spring", stiffness: 300, damping: 15 }}
              className="mb-4"
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
              className="text-green-600 text-2xl font-bold mb-2"
            >
              Заявка отправлена!
            </motion.div>
            <div className="text-blue-700 text-lg mb-6 text-center">Спасибо! Мы свяжемся с вами в ближайшее время.</div>
            <button
              className="mt-4 px-8 py-3 rounded-xl border-2 text-xl font-medium transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
              onClick={resetAll}
            >
              Заполнить ещё раз
            </button>
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  // Прогресс-бар с анимацией
  function ProgressBar() {
    if (!serviceType || step === 0) return null;
    return (
      <div className="w-full max-w-2xl flex flex-col items-center mb-8">
        <div className="relative w-full flex items-center justify-between" style={{ height: 40 }}>
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 w-full h-0.5 z-0" style={{ borderTop: '2px dashed #bbb' }} />
          {steps.map((s: StepConfig) => (
            <div
              key={s.key}
              className="relative z-10 flex flex-col items-center flex-1 min-w-[40px] mx-1"
            >
              <span
                className={`w-5 h-5 rounded-full border-2 ${(steps.indexOf(s) + 1) === step ? 'bg-blue-600 border-blue-600' : (steps.indexOf(s) + 1) < step ? 'bg-blue-400 border-blue-400' : 'bg-gray-300 border-gray-400'} transition-all duration-200`}
                style={{ display: 'inline-block' }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center py-8">
      {/* Прогресс-бар этапов */}
      <ProgressBar />
      {/* Блок этапа с анимацией размера */}
      <motion.div
        layout
        className="w-full bg-white rounded-3xl shadow-lg mb-8 flex flex-col items-center justify-center mx-auto"
        style={{ minWidth: 0 }}
        transition={{ type: 'spring', duration: 0.4 }}
      >
        <div ref={contentRef} className="w-full max-w-2xl mx-auto p-8 flex flex-col items-center justify-center">
          <div className="text-2xl font-semibold mb-4 text-gray-900">
            {step === 0 ? "Тип услуги" : steps[step - 1]?.label}
          </div>
          <div className="min-h-[120px] flex items-start w-full">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={step + '-' + serviceType}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: 'easeInOut' }}
                className="w-full"
              >
                {getStepContent()}
              </motion.div>
            </AnimatePresence>
          </div>
          {/* Кнопки управления шагами */}
          <div className="flex flex-row justify-between gap-4 mt-8">
            <button
              type="button"
              className="min-w-[120px] px-8 py-3 rounded-xl border-2 text-xl font-medium transition bg-white border-blue-200 text-blue-700 hover:bg-blue-50 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 shadow-sm"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
            >
              Назад
            </button>
            {serviceType && step === steps.length ? (
              <button
                type="button"
                className="min-w-[120px] px-8 py-3 rounded-xl border-2 text-xl font-medium transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 shadow-lg"
                onClick={handleSubmit}
                disabled={!isStepValid() || loading}
              >
                {loading ? "Отправка..." : "Завершить"}
              </button>
            ) : (
              <button
                type="button"
                className="min-w-[120px] px-8 py-3 rounded-xl border-2 text-xl font-medium transition bg-blue-600 text-white border-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-300 disabled:opacity-50 shadow-lg"
                onClick={() => setStep(s => s + 1)}
                disabled={!isStepValid()}
              >
                Далее
              </button>
            )}
          </div>
        </div>
      </motion.div>
      {/* Итоговая стоимость */}
      <div className="text-xl font-semibold text-blue-600 mt-2">итоговая стоимость от {calcPrice().toLocaleString()}р</div>
    </div>
  );
} 