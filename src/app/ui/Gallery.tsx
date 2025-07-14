"use client";
import Image from "next/image";

const works = [
  { src: "/photo1.webp", alt: "Кухня до/после" },
  { src: "/photo2.webp", alt: "Душевая до/после" },
  { src: "/photo3.jpg", alt: "Гостиная после уборки" },
  { src: "/photo4.webp", alt: "Ремонт до/после" },
];

export function Gallery() {
  const images = [...works, ...works];
  return (
    <div className="w-full overflow-hidden relative py-4">
      <div
        className="flex flex-row gap-8 animate-scroll-x"
        style={{
          width: `${works.length * 2 * 384 + (works.length * 2 - 1) * 32}px`, // 384 = w-96, 32 = gap-8
          animation: `scroll-x 30s linear infinite`,
        }}
      >
        {images.map((work, i) => (
          <div
            key={i}
            className="flex-shrink-0 bg-white rounded-2xl shadow-lg border border-blue-100 h-72 w-96 flex items-center justify-center overflow-hidden"
          >
            <Image
              src={work.src}
              alt={work.alt}
              width={384}
              height={288}
              className="object-cover w-full h-full rounded-2xl"
              style={{ aspectRatio: "4/3" }}
            />
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll-x {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
} 