"use client";
import { useState } from "react";
import Image from "next/image";

const links = [
  { href: "#services", label: "Услуги" },
  { href: "#gallery", label: "Примеры работ" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#leadform", label: "Оставить заявку" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur border-b border-blue-100 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">
        <a href="#" className="flex items-center gap-3">
          <Image src="/logo.jpg" alt="Логотип" width={40} height={40} className="rounded-full shadow-sm border border-blue-200 bg-white" />
          <span className="text-2xl font-extrabold text-blue-700 tracking-tight">ЧИСТО ВАУ!</span>
        </a>
        <div className="hidden md:flex gap-8">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-blue-700 font-medium hover:text-blue-900 transition-colors px-2 py-1 rounded hover:bg-blue-50"
            >
              {link.label}
            </a>
          ))}
        </div>
        <button
          className="md:hidden flex flex-col gap-1.5 p-2 rounded hover:bg-blue-100"
          onClick={() => setOpen(o => !o)}
          aria-label="Открыть меню"
        >
          <span className={`block w-6 h-0.5 bg-blue-700 transition-all ${open ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-blue-700 transition-all ${open ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-blue-700 transition-all ${open ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>
      {open && (
        <div className="md:hidden flex flex-col gap-2 px-4 pb-4 animate-fade-in-down bg-white/95 border-b border-blue-100">
          {links.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="text-blue-700 font-medium hover:text-blue-900 transition-colors px-2 py-2 rounded hover:bg-blue-50"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
      <style>{`
        @keyframes fade-in-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down { animation: fade-in-down 0.2s ease; }
      `}</style>
    </nav>
  );
} 