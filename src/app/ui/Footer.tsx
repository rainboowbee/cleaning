import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="w-full bg-white border-t border-blue-100 mt-12 py-8 px-4 flex flex-col items-center">
      <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Логотип и название */}
        <div className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Логотип" width={48} height={48} className="rounded-full shadow border border-blue-200 bg-white" />
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight">ЧИСТО ВАУ!</span>
        </div>
        {/* Кнопки */}
        <div className="flex flex-wrap gap-4 items-center justify-center">
          <a href="/privacy" className="text-blue-700 hover:text-blue-900 font-medium transition-colors px-3 py-1 rounded hover:bg-blue-100">Политика конфиденциальности</a>
          <a href="/contacts" className="text-blue-700 hover:text-blue-900 font-medium transition-colors px-3 py-1 rounded hover:bg-blue-100">Контакты</a>
          <a href="/offer" className="text-blue-700 hover:text-blue-900 font-medium transition-colors px-3 py-1 rounded hover:bg-blue-100">Публичная оферта</a>
        </div>
      </div>
      <div className="w-full max-w-5xl mt-6 text-center text-sm text-blue-400">© {new Date().getFullYear()} ЧИСТО ВАУ! Все права защищены.</div>
    </footer>
  );
} 