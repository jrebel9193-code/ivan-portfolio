"use client";

import { useEffect, useState } from "react";

const slides = [
  { type: "image", src: "/hero/photo-01.webp" },
  { type: "image", src: "/hero/photo-02.webp" },
  { type: "video", src: "/hero/video-01.mp4" },
  { type: "image", src: "/hero/photo-04.webp" },
  { type: "image", src: "/hero/photo-05.webp" },
  { type: "image", src: "/hero/photo-06.webp" },
];

export default function HeroSlider() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hero-slider" aria-label="Избранные работы">
      {slides.map((slide, index) =>
        slide.type === "video" ? (
          <video
            key={slide.src}
            src={slide.src}
            className={`hero-slide ${index === activeIndex ? "is-active" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          <img
            key={slide.src}
            src={slide.src}
            alt=""
            className={`hero-slide ${index === activeIndex ? "is-active" : ""}`}
          />
        )
      )}

      <div className="hero-overlay" />

      <div className="hero-title">
        <h1>ИВАН ЧЕРНЯВСКИЙ</h1>
        <p>ФОТО + ВИДЕО</p>
      </div>
    </div>
  );
}