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
        <p className="section-sub" style={{ color: 'rgba(253,250,246,0.65)' }}>
          Desliza para ver la transformación de este dormitorio: desde un espacio en obra hasta un diseño de autor a medida.
        </p>
      </div>
      <div className="ba-container reveal">
        <Image
          src="/img/dormitorio-antes.jpg"
          sizes="(max-width: 768px) 100vw, 650px"
          alt="Antes - Habitación vacía sin amoblar"
          className="ba-img-before"
          width={768}
          height={1024}
          quality={100}
          unoptimized={true}
          priority
        />
        <Image
          src="/img/dormitorio-despues.jpg"
          sizes="(max-width: 768px) 100vw, 650px"
          alt="Después - Dormitorio a medida Muebles Mesías instalado"
          className="ba-img-after"
          id="baAfter"
          style={{ clipPath: `inset(0 0 0 ${sliderValue}%)` }}
          width={768}
          height={1024}
          quality={100}
          unoptimized={true}
          priority
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
