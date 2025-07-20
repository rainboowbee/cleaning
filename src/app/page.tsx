import Image from "next/image";
import { Gallery } from "./ui/Gallery";
import { Reviews } from "./ui/Reviews";
import { ServiceCards } from "./ui/ServiceCards";
import { Navbar } from "./ui/Navbar";
import CalcBlock from "./ui/CalcBlock";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex flex-col gap-16 items-center w-full bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen pt-20">
        {/* Приветственный блок с CTA */}
        <section className="w-full bg-gradient-to-r from-blue-600 to-blue-400 py-16 flex flex-col items-center text-center px-4 shadow-lg rounded-b-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-white drop-shadow-lg">Профессиональная уборка квартир и офисов</h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl text-blue-100">Чистота и порядок без хлопот — доверьте уборку профессионалам!</p>
        </section>

        {/* О нас */}
        <section className="max-w-3xl w-full px-4">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">О нас</h2>
          <p className="text-lg text-gray-700">Мы — команда опытных клинеров, предоставляющая услуги уборки квартир, домов и офисов в вашем городе. Используем только безопасные и эффективные средства, гарантируем качество и пунктуальность.</p>
        </section>

        {/* Секция услуг */}
        <section id="services" className="w-full">
          <ServiceCards />
        </section>

        {/* Преимущества */}
        <section className="w-full bg-white/80 py-14 px-4 shadow-inner">
          <h2 className="text-2xl font-bold mb-10 text-center text-blue-700">Наши преимущества</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-blue-100">
              <Image src="/icons/quality.png" alt="Качество" width={64} height={64} className="mb-2" />
              <h3 className="font-semibold mt-4 mb-2 text-blue-800">Гарантия качества</h3>
              <p className="text-gray-600">Только проверенные клинеры и современные средства.</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-blue-100">
              <Image src="/icons/speed.png" alt="Скорость" width={64} height={64} className="mb-2" />
              <h3 className="font-semibold mt-4 mb-2 text-blue-800">Быстро и удобно</h3>
              <p className="text-gray-600">Оперативный выезд и гибкое бронирование.</p>
            </div>
            <div className="flex flex-col items-center text-center bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition-all duration-300 border border-blue-100">
              <Image src="/icons/support.png" alt="Поддержка" width={64} height={64} className="mb-2" />
              <h3 className="font-semibold mt-4 mb-2 text-blue-800">Поддержка 24/7</h3>
              <p className="text-gray-600">Всегда на связи для ваших вопросов и пожеланий.</p>
            </div>
          </div>
        </section>

        {/* Галерея */}
        <section className="max-w-5xl w-full px-4" id="gallery">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Примеры наших работ</h2>
          <Gallery />
        </section>

        {/* Отзывы */}
        <section className="max-w-3xl w-full px-4" id="reviews">
          <h2 className="text-2xl font-bold mb-4 text-blue-700">Отзывы клиентов</h2>
          <Reviews />
        </section>

        <div className="flex justify-center mt-8">
          <CalcBlock />
        </div>
      </main>
    </>
  );
}
