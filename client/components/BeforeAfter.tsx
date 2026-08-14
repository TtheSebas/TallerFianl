'use client';
import { useState } from 'react';
import Image from 'next/image';

export default function BeforeAfter() {
  const [sliderValue, setSliderValue] = useState(50);

  return (
    <section className="ba-section">
      <div className="collections-header">
        <p className="section-label">Transformaciones reales</p>
        <h2 className="section-title light">Antes y Después</h2>
        <p className="section-sub" style={{ color: 'rgba(253,250,246,0.55)' }}>
          Desliza para ver cómo transformamos los espacios de nuestros clientes.
        </p>
      </div>
      <div className="ba-container reveal">
        <Image src="/img/cocinas/10.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="Antes - espacio sin muebles"
          className="ba-img-before"
          width={800}
          height={500}
        />
        <Image src="/img/cocinas/186.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt="Después - cocina Mesias instalada"
          className="ba-img-after"
          id="baAfter"
          style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}
          width={800}
          height={500}
        />
        <div className="ba-slider" style={{ left: `${sliderValue}%` }} />
        <span className="ba-label ba-label--before">Antes</span>
        <span className="ba-label ba-label--after">Después</span>
        <input
          type="range"
          min="0"
          max="100"
          value={sliderValue}
          onChange={(e) => setSliderValue(Number(e.target.value))}
          className="ba-range"
          aria-label="Comparar antes y después"
        />
      </div>
    </section>
  );
}
