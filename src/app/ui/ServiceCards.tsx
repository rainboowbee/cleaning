"use client";
import { useState } from "react";
import Image from "next/image";

const services = [
  {
    title: "Химчистка мебели",
    icon: "🛋️",
    color: "from-pink-400 to-pink-600",
    description: "Глубокая чистка мягкой мебели с удалением пятен, запахов и аллергенов. Используем профессиональные гипоаллергенные средства, безопасные для детей и животных. Восстанавливаем свежесть и внешний вид диванов, кресел, стульев и матрасов. Удаляем даже сложные загрязнения и неприятные запахи, продлеваем срок службы вашей мебели.",
  },
  {
    title: "Дезинфекция",
    icon: "🦠",
    color: "from-green-400 to-green-600",
    description: "Комплексная обработка помещений от вирусов, бактерий и грибков с использованием сертифицированных препаратов. Подходит для квартир, офисов, коммерческих объектов, медицинских и детских учреждений. Гарантируем безопасность и быстрое восстановление санитарных норм. Эффективно устраняем источники инфекций и неприятных запахов.",
  },
  {
    title: "Дезинсекция",
    icon: "🐜",
    color: "from-yellow-400 to-yellow-600",
    description: "Профессиональное уничтожение насекомых (тараканов, муравьёв, клопов, блох, моли и др.) с гарантией результата. Применяем современные методы и препараты, безопасные для людей и домашних животных. Оперативно избавим ваш дом или офис от любых вредителей, обеспечим длительный защитный эффект.",
  },
  {
    title: "Клининг",
    icon: "🧹",
    color: "from-blue-400 to-blue-600",
    description: "Генеральная, поддерживающая и послеремонтная уборка квартир, домов и офисов. Используем профессиональное оборудование и экологичные средства. Удаляем пыль, грязь, строительные остатки, моем окна, чистим труднодоступные места. Гарантируем идеальную чистоту и свежесть в вашем помещении.",
  },
  {
    title: "Акарицидная обработка",
    icon: "🕷️",
    color: "from-purple-400 to-purple-600",
    description: "Обработка участков и помещений от клещей с применением эффективных и безопасных акарицидных средств. Защищаем детей, взрослых и домашних животных от укусов и инфекций. Проводим профилактические и экстренные обработки, даём рекомендации по дальнейшей защите территории.",
  },
  {
    title: "Покос травы",
    icon: "🌱",
    color: "from-lime-400 to-lime-600",
    description: "Покос и вывоз травы на участках любой площади. Быстро, аккуратно, с вывозом растительных остатков и уборкой территории. Работаем с газонами, садами, придомовыми и коммерческими территориями. Помогаем поддерживать ухоженный и аккуратный вид вашего участка на протяжении всего сезона.",
  },
];

export function ServiceCards() {
  const [selected, setSelected] = useState<number | null>(null);
  const handleOrder = () => {
    setSelected(null);
    const form = document.getElementById("leadform");
    if (form) form.scrollIntoView({ behavior: "smooth" });
  };
  // Массив с фото для каждой услуги (можно заменить на реальные фото)
  const serviceImages = [
    "/cardphoto/himchistka.jpg", // Химчистка мебели
    "/cardphoto/dezinf.jpg",    // Дезинфекция
    "/cardphoto/dezins.jpg",  // Дезинсекция (нет отдельного — временно cleaning)
    "/cardphoto/cleaning.jpg",  // Клининг
    "/cardphoto/akaric.jpg",    // Акарицидная обработка
    "/cardphoto/trava.jpg",     // Покос травы
  ];
  return (
    <div className="w-full py-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-blue-700">Наши услуги</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        {services.map((service, i) => (
          <button
            key={service.title}
            onClick={() => setSelected(i)}
            className={`group relative flex flex-col items-center justify-center p-8 rounded-3xl shadow-xl bg-gradient-to-br ${service.color} text-white transition-transform duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-4 focus:ring-blue-200`}
            style={{ minHeight: 180 }}
          >
            <span className="text-5xl mb-4 drop-shadow-lg group-hover:scale-110 transition-transform">{service.icon}</span>
            <span className="text-lg font-semibold text-center drop-shadow-sm">{service.title}</span>
            <span className="absolute inset-0 rounded-3xl border-2 border-white opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></span>
          </button>
        ))}
      </div>
      {/* Модальное окно-выкат с анимацией */}
      {selected !== null && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm">
          <div
            className="w-full sm:w-[480px] bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col animate-slide-up relative max-h-[100vh]"
            style={{ maxHeight: '100vh' }}
          >
            {/* Картинка сверху */}
            <div className="relative w-full h-56 sm:h-64 rounded-t-3xl overflow-hidden bg-blue-100 flex items-center justify-center">
              <Image
                src={serviceImages[selected]}
                alt={services[selected].title}
                fill
                style={{ objectFit: 'cover' }}
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 480px"
              />
              <button
                className="absolute top-4 left-4 bg-white/80 rounded-full p-2 shadow text-xl text-blue-700 hover:bg-white"
                onClick={() => setSelected(null)}
                aria-label="Закрыть"
              >
                ←
              </button>
            </div>
            {/* Контент */}
            <div className="flex-1 flex flex-col px-6 py-6 sm:py-8">
              <h3 className="text-2xl font-bold mb-2 text-blue-700" style={{ fontFamily: 'inherit' }}>{services[selected].title}</h3>
              <p className="text-gray-700 mb-6 text-base sm:text-lg" style={{ fontFamily: 'inherit' }}>{services[selected].description}</p>
              <div className="mt-auto flex justify-center">
                <button
                  className="w-full bg-blue-100 border border-blue-300 text-blue-800 font-semibold rounded-xl py-3 px-6 text-lg shadow hover:bg-blue-200 transition"
                  onClick={handleOrder}
                >
                  Оставить заявку
                </button>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
            .animate-slide-up { animation: slide-up 0.35s cubic-bezier(.4,1.4,.6,1) both; }
          `}</style>
        </div>
      )}
    </div>
  );
} 