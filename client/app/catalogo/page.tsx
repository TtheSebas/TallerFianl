'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import EditorialReveal from '@/components/EditorialReveal';
import { GALLERIES } from '@/lib/GalleryData';

// Types
interface CustomImageSlot {
  [key: string]: string; // slotId -> image url / dataUrl
}

// Curated default high-end photography for all 12 editorial spreads
const DEFAULT_CATALOG_IMAGES: Record<string, string> = {
  page1_cover: '/img/salaysofas/20.webp',
  page3_texture: '/img/proceso/157.webp',
  page4_wood_grain: '/img/proceso/158.webp',
  page4_joinery: '/img/proceso/225.webp',
  page5_sofa_main: '/img/salaysofas/111.webp',
  page5_sofa_detail1: '/img/salaysofas/113.webp',
  page5_sofa_detail2: '/img/salaysofas/169.webp',
  page6_sofa_wide: '/img/salaysofas/32.webp',
  page6_sofa_cushion: '/img/salaysofas/33.webp',
  page6_sofa_frame_wood: '/img/salaysofas/87.webp',
  page7_dining_hero: '/img/comedor/11.webp',
  page7_dining_chair: '/img/comedor/18.webp',
  page7_dining_corner: '/img/comedor/44.webp',
  page8_buffet: '/img/comedor/115.webp',
  page8_dining_lifestyle: '/img/comedor/117.webp',
  page9_bed1: '/img/dormitorio/1.webp',
  page9_nightstand: '/img/dormitorio/15.webp',
  page9_dresser: '/img/espejos/whatsapp-image-2026-06-07-at-9-34-45-pm8.webp',
  page9_bed_detail: '/img/dormitorio/61.webp',
  page10_closet_main: '/img/closet/49.webp',
  page10_closet_drawers: '/img/closet/166.webp',
  page10_closet_doors: '/img/closet/181.webp',
  page11_kitchen: '/img/cocinas/183.webp',
  page11_bathroom: '/img/bano/64.webp',
  page11_office: '/img/oficina/100.webp',
};

export default function CatalogoPresentation() {
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'slider' | 'all' | 'grid'>('slider');
  const [images, setImages] = useState<CustomImageSlot>(DEFAULT_CATALOG_IMAGES);
  const [activeModalSlot, setActiveModalSlot] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('sala');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const TOTAL_PAGES = 12;

  // Load custom images from localStorage on mount (merges with defaults)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('muebles_mesias_catalog_images');
      if (saved) {
        setImages({ ...DEFAULT_CATALOG_IMAGES, ...JSON.parse(saved) });
      } else {
        setImages(DEFAULT_CATALOG_IMAGES);
      }
    } catch (e) {
      console.error('Error loading saved catalog images', e);
    }
  }, []);

  // Save to localStorage when updated
  const updateSlotImage = (slotId: string, url: string) => {
    setImages((prev) => {
      const updated = { ...prev, [slotId]: url };
      try {
        localStorage.setItem('muebles_mesias_catalog_images', JSON.stringify(updated));
      } catch (e) {
        console.error('Storage quota exceeded or error', e);
      }
      return updated;
    });
    setActiveModalSlot(null);
  };

  const removeSlotImage = (slotId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setImages((prev) => {
      const updated = { ...prev };
      delete updated[slotId];
      try {
        localStorage.setItem('muebles_mesias_catalog_images', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetAllImages = () => {
    if (window.confirm('¿Deseas restablecer todas las fotografías a la selección curada por defecto?')) {
      setImages(DEFAULT_CATALOG_IMAGES);
      localStorage.removeItem('muebles_mesias_catalog_images');
    }
  };

  // Drag and Drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (slotId: string, e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (uploadEvent) => {
          if (uploadEvent.target?.result) {
            updateSlotImage(slotId, uploadEvent.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && activeModalSlot) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          updateSlotImage(activeModalSlot, uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (activeModalSlot) return;
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setCurrentPage((prev) => Math.min(prev + 1, TOTAL_PAGES));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalSlot]);

  // Image Frame Placeholder Component
  const ImageFrame = ({
    id,
    label,
    aspect = '4/3',
    className = '',
    style = {},
  }: {
    id: string;
    label: string;
    aspect?: string;
    className?: string;
    style?: React.CSSProperties;
  }) => {
    const imgUrl = images[id];

    return (
      <div
        className={`editorial-frame ${imgUrl ? 'has-image' : 'is-empty'} ${className}`}
        style={{
          aspectRatio: aspect,
          ...style,
        }}
        onDragOver={handleDragOver}
        onDrop={(e) => handleDrop(id, e)}
        onClick={() => setActiveModalSlot(id)}
      >
        {imgUrl ? (
          <div className="frame-image-wrapper">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={imgUrl} alt={label} className="frame-image" />
            <div className="frame-actions">
              <button
                className="frame-btn frame-btn-change"
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveModalSlot(id);
                }}
                title="Cambiar foto"
              >
                Cambiar
              </button>
              <button
                className="frame-btn frame-btn-remove"
                onClick={(e) => removeSlotImage(id, e)}
                title="Quitar foto"
              >
                &times;
              </button>
            </div>
          </div>
        ) : (
          <div className="frame-placeholder-content">
            <div className="placeholder-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
            </div>
            <p className="placeholder-label">{label}</p>
            <span className="placeholder-hint">Arrastra una imagen o clic para elegir</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="catalog-presentation-container">
      {/* Editorial Top Toolbar */}
      <header className="catalog-toolbar no-print">
        <div className="toolbar-left">
          <Link href="/" className="back-link">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            <span>Volver al Inicio</span>
          </Link>
          <div className="toolbar-divider"></div>
          <span className="brand-title">MUEBLES MESÍAS</span>
          <span className="edition-badge">CATÁLOGO EDITORIAL 2026</span>
        </div>

        <div className="toolbar-center">
          <div className="view-mode-selector">
            <button
              className={`mode-btn ${viewMode === 'slider' ? 'active' : ''}`}
              onClick={() => setViewMode('slider')}
              title="Vista Revista / Presentación"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="3" width="20" height="18" rx="2" />
                <path d="M12 3v18" />
              </svg>
              Revista
            </button>
            <button
              className={`mode-btn ${viewMode === 'all' ? 'active' : ''}`}
              onClick={() => setViewMode('all')}
              title="Ver todas las páginas en lista"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
              Páginas ({TOTAL_PAGES})
            </button>
            <button
              className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              title="Vista cuadrícula general"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
              Cuadrícula
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <button className="tool-btn btn-reset" onClick={resetAllImages} title="Vaciar marcos de fotos">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
            Limpiar Fotos
          </button>
          <button className="tool-btn btn-print" onClick={() => window.print()} title="Imprimir o Guardar en PDF">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="6 9 6 2 18 2 18 9" />
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
              <rect x="6" y="14" width="12" height="8" />
            </svg>
            Imprimir / Guardar PDF
          </button>
        </div>
      </header>

      {/* Main Pages Canvas */}
      <main className={`catalog-canvas mode-${viewMode}`}>
        {/* ========================================================================= */}
        {/* PÁGINA 1: PORTADA */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-1 cover-page ${
            viewMode === 'slider' && currentPage !== 1 ? 'hidden-page' : ''
          }`}
          data-page="1"
        >
          <EditorialReveal delay={150} className="page-inner cover-layout">
            <div className="cover-header">
              <p className="cover-edition-tag">COLECCIÓN DE ALTA GAMA · EDICIÓN 2026</p>
              <div className="cover-rule"></div>
              <p className="cover-location">AMBATO, ECUADOR</p>
            </div>

            <div className="cover-titles">
              <h1 className="cover-main-title">
                LÍNEA DE MUEBLES <br />
                <span className="serif-highlight">MESÍAS</span>
              </h1>
              <p className="cover-subtitle">Artesanía que cuenta tu historia</p>
            </div>

            <div className="cover-hero-slot">
              <ImageFrame
                id="page1_cover"
                label="Foto de Portada a Sangre (Salón Moderno / Pieza de Autor)"
                aspect="16/9"
                className="cover-image-frame"
              />
            </div>

            <div className="cover-footer">
              <div className="cover-seal">
                <span>100% MADERA PURA</span>
                <span>+15 AÑOS DE HERENCIA</span>
              </div>
              <div className="cover-curation-text">
                CATÁLOGO EXCLUSIVO DE CARPINTERÍA ARQUITECTÓNICA Y MOBILIARIO A MEDIDA
              </div>
              <div className="page-number-stamp">PÁG. 01</div>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 2: ÍNDICE & MANIFIESTO EDITORIAL */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-2 ${
            viewMode === 'slider' && currentPage !== 2 ? 'hidden-page' : ''
          }`}
          data-page="2"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">01 · SUMARIO & MANIFIESTO</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="editorial-split-grid">
              <div className="editorial-text-col">
                <span className="section-eyebrow">EDITORIAL</span>
                <h2 className="editorial-heading">
                  El Arte de Habitar con <br />
                  <em>Propósito y Calidez</em>
                </h2>
                <div className="editorial-lead-dropcap">
                  <span className="dropcap">C</span>ada mueble que sale de nuestro taller es una obra concebida para resistir el
                  paso del tiempo. No creemos en el mobiliario descartable; creemos en la nobleza de la madera
                  estacionada, en los ensambles precisos y en las vetas que narran la historia de nuestra tierra.
                </div>
                <p className="editorial-paragraph">
                  Desde hace más de 15 años, la familia Mesías ha transformado hogares en Ambato y en todo el
                  Ecuador, combinando la tradición ebanista con las líneas depuradas del interiorismo contemporáneo.
                  Este catálogo reúne nuestras mejores creaciones, pensadas para quienes valoran la autenticidad y el lujo
                  silencioso.
                </p>

                <div className="curator-signature">
                  <p className="signature-title">Taller Artesanal Mesías</p>
                  <p className="signature-role">Maestría en Carpintería Arquitectónica</p>
                </div>
              </div>

              <div className="editorial-index-col">
                <span className="section-eyebrow">ÍNDICE DE CONTENIDOS</span>
                <ul className="index-list">
                  <li className="index-item" onClick={() => setCurrentPage(3)}>
                    <span className="index-num">03</span>
                    <div className="index-content">
                      <strong>Filosofía, Calidad & Madera Certificada</strong>
                      <small>Nuestra promesa de 1 año de garantía y selección botánica</small>
                    </div>
                  </li>
                  <li className="index-item" onClick={() => setCurrentPage(4)}>
                    <span className="index-num">04</span>
                    <div className="index-content">
                      <strong>Materiales Nobles & Procesos</strong>
                      <small>Seique, Laurel, Cedro y acabados al aceite natural</small>
                    </div>
                  </li>
                  <li className="index-item" onClick={() => setCurrentPage(5)}>
                    <span className="index-num">05</span>
                    <div className="index-content">
                      <strong>Colección Salas & Sofás</strong>
                      <small>Diseños asimétricos, confort envolvente y textiles premium</small>
                    </div>
                  </li>
                  <li className="index-item" onClick={() => setCurrentPage(7)}>
                    <span className="index-num">07</span>
                    <div className="index-content">
                      <strong>Colección Comedores de Autor</strong>
                      <small>Mesas de gran formato y sillas de geometría ergonómica</small>
                    </div>
                  </li>
                  <li className="index-item" onClick={() => setCurrentPage(9)}>
                    <span className="index-num">09</span>
                    <div className="index-content">
                      <strong>Dormitorios & Closets a Medida</strong>
                      <small>Santuarios de descanso y sistemas de almacenaje inteligente</small>
                    </div>
                  </li>
                  <li className="index-item" onClick={() => setCurrentPage(11)}>
                    <span className="index-num">11</span>
                    <div className="index-content">
                      <strong>Carpintería Arquitectónica</strong>
                      <small>Cocinas, vanitorios y proyectos residenciales especiales</small>
                    </div>
                  </li>
                  <li className="index-item" onClick={() => setCurrentPage(12)}>
                    <span className="index-num">12</span>
                    <div className="index-content">
                      <strong>Garantía & Proceso de Reserva</strong>
                      <small>50% de reserva e instalación gratuita en la región central</small>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">LINEA DE MUEBLES MESÍAS</span>
              <span className="footer-page-num">02</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 3: FILOSOFÍA & CALIDAD */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-3 ${
            viewMode === 'slider' && currentPage !== 3 ? 'hidden-page' : ''
          }`}
          data-page="3"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">02 · FILOSOFÍA & HERENCIA</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="content-grid-2col-asym">
              <div className="col-text-primary">
                <span className="section-eyebrow">HERENCIA Y RIGOR</span>
                <h2 className="editorial-heading">
                  Más de 15 años dando vida a la <em>madera noble</em>
                </h2>

                <div className="manifesto-box">
                  <p className="manifesto-quote">
                    «No fabricamos muebles en serie; esculpimos piezas irrepetibles con personalidad, alma y proporciones
                    perfectas.»
                  </p>
                </div>

                <p className="editorial-paragraph">
                  En <strong>Muebles Mesías</strong> cada pieza comienza con la selección rigurosa de maderas
                  estacionadas y secadas en horno para evitar deformaciones con los cambios climáticos de la serranía y el
                  oriente ecuatoriano.
                </p>

                <div className="pillars-grid">
                  <div className="pillar-card">
                    <div className="pillar-num">01</div>
                    <h4>Madera 100% Certificada</h4>
                    <p>Tablones macizos de fuentes sostenibles y reforestadas, seleccionados por la pureza de sus vetas.</p>
                  </div>
                  <div className="pillar-card">
                    <div className="pillar-num">02</div>
                    <h4>Garantía Escrita de 1 Año</h4>
                    <p>Respaldo total en ensamble estructural, herrajes de alta gama y durabilidad de acabados.</p>
                  </div>
                  <div className="pillar-card">
                    <div className="pillar-num">03</div>
                    <h4>Acabados Poliuretánicos</h4>
                    <p>Capas de protección mate y satinada resistentes a la humedad, líquidos y rayaduras leves.</p>
                  </div>
                </div>
              </div>

              <div className="col-photo-feature">
                <ImageFrame
                  id="page3_texture"
                  label="Detalle de Textura de Madera / Ensamble Artesanal"
                  aspect="3/4"
                  className="tall-feature-frame"
                />
                <p className="photo-caption">
                  Fig. 3.1 — Veta natural de laurel pulido a mano con cera natural y aceite protector.
                </p>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">CALIDAD Y COMPROMISO ARTESANAL</span>
              <span className="footer-page-num">03</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 4: MATERIALES NOBLES & PROCESO */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-4 ${
            viewMode === 'slider' && currentPage !== 4 ? 'hidden-page' : ''
          }`}
          data-page="4"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">03 · PROCESO & MATERIA PRIMA</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="center-header-block">
              <span className="section-eyebrow">MAESTRÍA EN CADA PASO</span>
              <h2 className="editorial-heading-center">La Anatomía del Mueble Perfecto</h2>
              <p className="editorial-sub-center">
                Unión armónica entre la carpintería clásica de espiga y caja con tecnología de corte de alta precisión.
              </p>
            </div>

            <div className="dual-photo-grid">
              <div className="photo-block">
                <ImageFrame
                  id="page4_wood_grain"
                  label="Foto: Selección de Madera / Taller de Corte"
                  aspect="4/3"
                />
                <div className="photo-detail-text">
                  <h4>01. Curaduría y Estacionamiento</h4>
                  <p>Maderas nobles con humedad controlada al 10-12% para asegurar estabilidad dimensional infinita.</p>
                </div>
              </div>

              <div className="photo-block">
                <ImageFrame
                  id="page4_joinery"
                  label="Foto: Acabado Manual / Ensamble a Inglete"
                  aspect="4/3"
                />
                <div className="photo-detail-text">
                  <h4>02. Lijado y Barnizado Orgánico</h4>
                  <p>Hasta cinco pasadas de lija al agua y aplicación manual de selladores ecofriendly libres de plomo.</p>
                </div>
              </div>
            </div>

            <div className="wood-spec-strip">
              <div className="spec-item">
                <span className="spec-name">SEIQUE / CEDRO</span>
                <span className="spec-desc">Vetas doradas, densidad media-alta y resistencia acústica superior.</span>
              </div>
              <div className="spec-item">
                <span className="spec-name">LAUREL DEL ORIENTE</span>
                <span className="spec-desc">Contrastes oscuros elegantes, dureza excepcional y brillo satinado.</span>
              </div>
              <div className="spec-item">
                <span className="spec-name">ROBLE & EUCALIPTO TRATADO</span>
                <span className="spec-desc">Estructuras internas ultra reforzadas con resistencia al desgaste.</span>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">PROCESO ARTESANAL Y SOSTENIBILIDAD</span>
              <span className="footer-page-num">04</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 5: COLECCIÓN SALAS & SOFÁS (GRID ASIMÉTRICO) */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-5 ${
            viewMode === 'slider' && currentPage !== 5 ? 'hidden-page' : ''
          }`}
          data-page="5"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">04 · COLECCIÓN LIVING</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">COLECCIÓN PRINCIPAL</span>
                <h2 className="editorial-heading">Salas & Sofás</h2>
              </div>
              <div className="title-desc-right">
                <p>
                  Diseños modernos y clásicos a medida. Estructuras macizas con espumas de alta densidad y textiles
                  anti-fluidos con paletas neutras atemporales.
                </p>
                <span className="custom-tag">✦ DISEÑO A MEDIDA DISPONIBLE</span>
              </div>
            </div>

            {/* Asymmetric 3-photo Grid */}
            <div className="asymmetric-3grid">
              <div className="grid-hero-col">
                <ImageFrame
                  id="page5_sofa_main"
                  label="Foto Principal: Juego de Sala Principal / Sofá Seccional"
                  aspect="3/4"
                  className="hero-sofa-frame"
                />
              </div>
              <div className="grid-stacked-col">
                <ImageFrame
                  id="page5_sofa_detail1"
                  label="Foto Detalle: Sillón Individual / Butaca de Acento"
                  aspect="16/10"
                />
                <ImageFrame
                  id="page5_sofa_detail2"
                  label="Foto Ambiente: Mesa de Centro en Madera & Tapicería"
                  aspect="16/10"
                />
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">SALAS DE ESTAR Y CONFORT RESIDENCIAL</span>
              <span className="footer-page-num">05</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 6: SALAS & SOFÁS EN DETALLE */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-6 ${
            viewMode === 'slider' && currentPage !== 6 ? 'hidden-page' : ''
          }`}
          data-page="6"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">04 · COLECCIÓN LIVING (DETALLES)</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="editorial-split-wide">
              <div className="wide-photo-container">
                <ImageFrame
                  id="page6_sofa_wide"
                  label="Foto Panorámica: Sala Completa en Espacio Real"
                  aspect="16/9"
                  className="panoramic-frame"
                />
              </div>

              <div className="dual-detail-row">
                <div className="detail-card">
                  <ImageFrame
                    id="page6_sofa_cushion"
                    label="Foto: Detalle de Costuras y Telas Lino / Terciopelo"
                    aspect="4/3"
                  />
                  <h4>Textiles de Alta Resistencia</h4>
                  <p>Tejidos de lino importado, chenille y cuerina automotriz con protección repelente al agua.</p>
                </div>
                <div className="detail-card">
                  <ImageFrame
                    id="page6_sofa_frame_wood"
                    label="Foto: Base y Patas de Madera Torneada / Cónica"
                    aspect="4/3"
                  />
                  <h4>Estructura en Madera Seca</h4>
                  <p>Esqueleto interno ensamblado con pernos de acero y cinchado elástico de alta tensión.</p>
                </div>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">ERGONOMÍA Y CONFORT PERSONALIZADO</span>
              <span className="footer-page-num">06</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 7: COLECCIÓN COMEDORES (IMAGEN CENTRAL + SUPERPUESTAS) */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-7 ${
            viewMode === 'slider' && currentPage !== 7 ? 'hidden-page' : ''
          }`}
          data-page="7"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">05 · COLECCIÓN COMEDORES</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">PUNTOS DE ENCUENTRO</span>
                <h2 className="editorial-heading">Comedores</h2>
              </div>
              <div className="title-desc-right">
                <p>
                  Mesas y sillas para reuniones que se convierten en recuerdos. Desde 4 hasta 12 puestos, fabricadas en
                  tablones continuos con vetas seleccionadas.
                </p>
                <span className="custom-tag">✦ MESAS FIJAS O EXTENSIBLES</span>
              </div>
            </div>

            {/* Overlapping Hero Layout */}
            <div className="overlapping-dining-layout">
              <div className="dining-main-frame">
                <ImageFrame
                  id="page7_dining_hero"
                  label="Foto Central Grande: Juego de Comedor Completo (6 a 8 Puestos)"
                  aspect="16/10"
                  className="dining-hero-img"
                />
              </div>

              <div className="dining-accents-row">
                <div className="dining-accent-card">
                  <ImageFrame
                    id="page7_dining_chair"
                    label="Detalle Silla: Respaldo Ergonómico"
                    aspect="1/1"
                    className="accent-frame"
                  />
                  <span>Sillas tapizadas ergonómicas</span>
                </div>
                <div className="dining-accent-card">
                  <ImageFrame
                    id="page7_dining_corner"
                    label="Detalle Mesa: Unión de Tablero y Base"
                    aspect="1/1"
                    className="accent-frame"
                  />
                  <span>Acabado mate vitrificado</span>
                </div>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">MESAS DE COMEDOR Y SILLAS DE AUTOR</span>
              <span className="footer-page-num">07</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 8: COMEDORES & APARADORES DE DISEÑO */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-8 ${
            viewMode === 'slider' && currentPage !== 8 ? 'hidden-page' : ''
          }`}
          data-page="8"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">05 · MOBILIARIO DE COMEDOR (COMPLEMENTOS)</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="split-grid-50-50">
              <div className="column-left">
                <ImageFrame
                  id="page8_buffet"
                  label="Foto: Aparador Buffet / Trinchero Moderno en Madera"
                  aspect="4/3"
                />
                <div className="product-desc-box">
                  <span className="product-category">APARADORES & BUFFETS</span>
                  <h3>Trinchero Escandinavo en Laurel</h3>
                  <p>
                    Puertas con sistema push-to-open, gavetas ocultas para cubertería forradas en terciopelo y patas en
                    ángulo de roble macizo.
                  </p>
                </div>
              </div>

              <div className="column-right">
                <ImageFrame
                  id="page8_dining_lifestyle"
                  label="Foto: Detalle de Vajillero con Luz LED / Vitrina"
                  aspect="4/3"
                />
                <div className="product-desc-box">
                  <span className="product-category">VITRINAS & REPISAS</span>
                  <h3>Vitrinas con Vidrio Templado</h3>
                  <p>
                    Marcos delgados de madera noble con iluminación cálida 2700K oculta para exhibición de piezas de
                    cristalería y vajillas finas.
                  </p>
                </div>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">COMPLEMENTOS DE COMEDOR Y ALMACENAJE</span>
              <span className="footer-page-num">08</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 9: DORMITORIOS A MEDIDA (4 FOTOS CUADRADAS) */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-9 ${
            viewMode === 'slider' && currentPage !== 9 ? 'hidden-page' : ''
          }`}
          data-page="9"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">06 · SANTUARIOS DE DESCANSO</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">SUITES & DORMITORIOS</span>
                <h2 className="editorial-heading">Dormitorios a Medida</h2>
              </div>
              <div className="title-desc-right">
                <p>
                  Camas, respaldos flotantes y veladores con acabados en maderas nobles. Soluciones diseñadas para
                  crear atmósferas de profunda serenidad y descanso.
                </p>
                <span className="custom-tag">✦ PLAZAS: 2, 2.5 Y 3 (KING / QUEEN)</span>
              </div>
            </div>

            {/* 4 Square Photos Grid */}
            <div className="square-4grid">
              <div className="grid-cell">
                <ImageFrame
                  id="page9_bed1"
                  label="Foto 1: Cama King / Queen con Respaldo Tapizado"
                  aspect="1/1"
                />
                <span className="cell-label">Cama Flotante con Respaldo Acolchado</span>
              </div>
              <div className="grid-cell">
                <ImageFrame
                  id="page9_nightstand"
                  label="Foto 2: Velador de Noche Suspendido con Luz"
                  aspect="1/1"
                />
                <span className="cell-label">Veladores Minimalistas con Gavetas Soft-Close</span>
              </div>
              <div className="grid-cell">
                <ImageFrame
                  id="page9_dresser"
                  label="Foto 3: Peinadora / Cómoda con Espejo Circular"
                  aspect="1/1"
                />
                <span className="cell-label">Cómoda Peinadora con Espejo Biselado</span>
              </div>
              <div className="grid-cell">
                <ImageFrame
                  id="page9_bed_detail"
                  label="Foto 4: Detalle de Vetas y Uniones de Cabecero"
                  aspect="1/1"
                />
                <span className="cell-label">Detalle de Cabecero en Roble Macizo</span>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">DORMITORIOS Y MOBILIARIO DE DESCANSO</span>
              <span className="footer-page-num">09</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 10: CLOSETS & VESTIDORES INTELIGENTES */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-10 ${
            viewMode === 'slider' && currentPage !== 10 ? 'hidden-page' : ''
          }`}
          data-page="10"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">07 · ALMACENAMIENTO ARQUITECTÓNICO</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="content-grid-2col-asym">
              <div className="col-photo-feature">
                <ImageFrame
                  id="page10_closet_main"
                  label="Foto: Walk-in Closet Completo con Iluminación LED"
                  aspect="3/4"
                  className="tall-feature-frame"
                />
              </div>

              <div className="col-text-primary">
                <span className="section-eyebrow">MÁXIMO APROVECHAMIENTO</span>
                <h2 className="editorial-heading">
                  Closets & Vestidores <br />
                  <em>de Alta Gama</em>
                </h2>

                <p className="editorial-paragraph">
                  Diseñamos vestidores a medida adaptados a la geometría de tu habitación. Cada centímetro cuenta con una
                  función específica: pantaloneros extraíbles, zapateras inclinadas, organizadores de joyas y barras con
                  iluminación indirecta.
                </p>

                <div className="stacked-detail-images">
                  <div className="mini-photo-item">
                    <ImageFrame
                      id="page10_closet_drawers"
                      label="Detalle: Gavetas y Organizadores de Cuero/Madera"
                      aspect="16/9"
                    />
                    <small>Gavetas con correderas telescópicas pesadas de cierre suave.</small>
                  </div>
                  <div className="mini-photo-item">
                    <ImageFrame
                      id="page10_closet_doors"
                      label="Detalle: Puertas Corredizas o Batientes con Espejo"
                      aspect="16/9"
                    />
                    <small>Puertas corredizas con rieles silenciosos de aluminio anodizado.</small>
                  </div>
                </div>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">SISTEMAS DE CLOSET Y WALK-IN CLOSETS</span>
              <span className="footer-page-num">10</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 11: COCINAS, BAÑOS & PROYECTOS INTEGRALES */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-11 ${
            viewMode === 'slider' && currentPage !== 11 ? 'hidden-page' : ''
          }`}
          data-page="11"
        >
          <EditorialReveal delay={150} className="page-inner">
            <div className="page-top-header">
              <span className="page-chapter">08 · PROYECTOS ARQUITECTÓNICOS</span>
              <span className="page-header-brand">MUEBLES MESÍAS</span>
            </div>

            <div className="section-title-row">
              <div>
                <span className="section-eyebrow">ESPACIOS A MEDIDA</span>
                <h2 className="editorial-heading">Cocinas, Baños & Oficinas</h2>
              </div>
              <div className="title-desc-right">
                <p>
                  Integramos maderas tropicales con mesones de cuarzo y granito. Soluciones completas para proyectos
                  residenciales y comerciales.
                </p>
                <span className="custom-tag">✦ SERVICIO DE DISEÑO Y MODELADO 3D</span>
              </div>
            </div>

            <div className="triplet-photo-grid">
              <div className="triplet-card">
                <ImageFrame
                  id="page11_kitchen"
                  label="Foto: Cocina Integral con Isla y Madera Noble"
                  aspect="4/3"
                />
                <h4>Cocinas Integrales</h4>
                <p>Módulos termoformados e hidrófugos resistentes al vapor y grasa.</p>
              </div>
              <div className="triplet-card">
                <ImageFrame
                  id="page11_bathroom"
                  label="Foto: Mueble de Baño Flotante con Lavabo Sobrepuesto"
                  aspect="4/3"
                />
                <h4>Muebles de Baño</h4>
                <p>Madera tratada con selladores náuticos contra la humedad.</p>
              </div>
              <div className="triplet-card">
                <ImageFrame
                  id="page11_office"
                  label="Foto: Escritorio Ejecutivo / Biblioteca a Medida"
                  aspect="4/3"
                />
                <h4>Estudios & Oficinas</h4>
                <p>Escritorios ergonómicos y estanterías flotantes de autor.</p>
              </div>
            </div>

            <div className="page-footer">
              <span className="footer-left">CARPINTERÍA INTEGRAL PARA EL HOGAR</span>
              <span className="footer-page-num">11</span>
            </div>
          </EditorialReveal>
        </section>

        {/* ========================================================================= */}
        {/* PÁGINA 12: CONTRAPORTADA (BACK COVER - FONDO OSCURO) */}
        {/* ========================================================================= */}
        <section
          className={`editorial-page page-12 back-cover ${
            viewMode === 'slider' && currentPage !== 12 ? 'hidden-page' : ''
          }`}
          data-page="12"
        >
          <EditorialReveal delay={150} className="page-inner back-cover-layout">
            <div className="back-cover-top">
              <div className="back-cover-badge">LÍNEA DE MUEBLES MESÍAS</div>
              <div className="back-cover-line"></div>
            </div>

            <div className="back-cover-center">
              <span className="back-cover-pretitle">TRANSFORMA TU ESPACIO</span>
              <h2 className="back-cover-title">
                Comencemos a Crear Tu <br />
                <em>Próxima Pieza de Autor</em>
              </h2>

              <div className="back-cover-conditions">
                <div className="condition-pill">
                  <div className="pill-icon">✦</div>
                  <div className="pill-text">
                    <strong>Reserva con el 50%</strong>
                    <span>El saldo restante se abona contra entrega a tu total satisfacción</span>
                  </div>
                </div>

                <div className="condition-pill highlight-pill">
                  <div className="pill-icon">🚚</div>
                  <div className="pill-text">
                    <strong>Instalación Gratuita Sin Costo Adicional</strong>
                    <span>Cobertura directa en Ambato, Riobamba, Latacunga y Puyo</span>
                  </div>
                </div>

                <div className="condition-pill">
                  <div className="pill-icon">🛡️</div>
                  <div className="pill-text">
                    <strong>Garantía Escrita de 1 Año</strong>
                    <span>Respaldo total del taller artesanal en materiales y manufactura</span>
                  </div>
                </div>
              </div>

              <div className="back-cover-cta-block">
                <a
                  href="https://wa.me/593995795486?text=Hola%20Muebles%20Mesias,%20deseo%20cotizar%20un%20proyecto%20a%20medida%20de%20su%20catalogo"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="back-cover-whatsapp-btn"
                >
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  <span>Solicitar Asesoría & Cotización por WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="back-cover-footer">
              <div className="contact-info-grid">
                <div>
                  <small>UBICACIÓN DEL TALLER</small>
                  <p>Ambato, Tungurahua — Ecuador</p>
                </div>
                <div>
                  <small>ATENCIÓN PERSONALIZADA</small>
                  <p>Lunes a Sábado: 8:00am - 7:00pm</p>
                </div>
                <div>
                  <small>ENVÍOS & MONTAJE</small>
                  <p>Ambato · Riobamba · Latacunga · Puyo</p>
                </div>
              </div>
              <div className="back-cover-copyright">
                © 2026 Línea de Muebles Mesías. Todos los derechos reservados.
              </div>
              <div className="page-number-stamp">PÁG. 12</div>
            </div>
          </EditorialReveal>
        </section>
      </main>

      {/* Floating Bottom Navigator for Slider Mode */}
      {viewMode === 'slider' && (
        <footer className="catalog-slider-nav no-print">
          <button
            className="nav-arrow-btn"
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            aria-label="Página anterior"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <div className="slider-pages-strip">
            {Array.from({ length: TOTAL_PAGES }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                className={`page-pill-btn ${currentPage === pageNum ? 'active' : ''}`}
                onClick={() => setCurrentPage(pageNum)}
              >
                {pageNum < 10 ? `0${pageNum}` : pageNum}
              </button>
            ))}
          </div>

          <button
            className="nav-arrow-btn"
            onClick={() => setCurrentPage((p) => Math.min(p + 1, TOTAL_PAGES))}
            disabled={currentPage === TOTAL_PAGES}
            aria-label="Página siguiente"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </footer>
      )}

      {/* Image Picker Modal from Existing Gallery */}
      {activeModalSlot && (
        <div className="image-picker-modal-backdrop" onClick={() => setActiveModalSlot(null)}>
          <div className="image-picker-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-tag">CONFIGURAR FOTOGRAFÍA</span>
                <h3 className="modal-title">Selecciona una imagen para este marco</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveModalSlot(null)}>
                &times;
              </button>
            </div>

            <div className="modal-upload-bar">
              <div className="upload-cta">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  className="upload-btn"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
                  </svg>
                  Subir Foto desde tu Computadora
                </button>
                <span className="upload-tip">o selecciona directamente una de las fotos de tu galería:</span>
              </div>
            </div>

            {/* Category tabs */}
            <div className="gallery-tabs">
              {Object.entries(GALLERIES)
                .filter(([key]) => key !== 'videosexibicion' && key !== 'proceso')
                .map(([key, cat]) => (
                  <button
                    key={key}
                    className={`gallery-tab-btn ${selectedCategory === key ? 'active' : ''}`}
                    onClick={() => setSelectedCategory(key)}
                  >
                    {cat.title} ({cat.images?.length || 0})
                  </button>
                ))}
            </div>

            {/* Photos Grid */}
            <div className="modal-photos-grid">
              {GALLERIES[selectedCategory]?.images?.map((img, idx) => (
                <div
                  key={idx}
                  className="modal-photo-item"
                  onClick={() => updateSlotImage(activeModalSlot, `/${img.src}`)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={`/${img.src}`} alt={img.alt} loading="lazy" />
                  <div className="photo-select-overlay">
                    <span>Usar esta foto</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Scoped CSS Styles for Editorial Luxury Magazine Look & Print */}
      <style jsx global>{`
        /* Reset and Base variables */
        :root {
          --color-bg-pure: #ffffff;
          --color-bg-warm: #fcfbfa;
          --color-bg-sand: #f5f2ed;
          --color-bg-charcoal: #1e1a17;
          --color-wood-dark: #2c1a0e;
          --color-accent-gold: #c09250;
          --color-accent-gold-soft: rgba(192, 146, 80, 0.18);
          --color-text-main: #2b2521;
          --color-text-muted: #6e645e;
          --color-border-subtle: rgba(44, 26, 14, 0.08);
          --font-serif-luxury: var(--font-playfair, 'Playfair Display', Georgia, serif);
          --font-sans-clean: var(--font-inter, 'Montserrat', -apple-system, sans-serif);
        }

        .catalog-presentation-container {
          min-height: 100vh;
          background-color: #e8e3dc;
          color: var(--color-text-main);
          font-family: var(--font-sans-clean);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-bottom: 90px;
        }

        /* Top Toolbar */
        .catalog-toolbar {
          position: sticky;
          top: 0;
          z-index: 1000;
          width: 100%;
          background: rgba(14, 14, 14, 0.98);
          backdrop-filter: blur(14px);
          border-bottom: 1px solid rgba(192, 146, 80, 0.25);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.75rem 2rem;
          color: #fdfaf6;
        }

        .toolbar-left {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .back-link {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: #c09250;
          text-decoration: none;
          font-size: 0.82rem;
          font-weight: 500;
          letter-spacing: 0.05em;
          transition: color 0.2s;
        }

        .back-link:hover {
          color: #fdfaf6;
        }

        .toolbar-divider {
          width: 1px;
          height: 18px;
          background: rgba(253, 250, 246, 0.15);
        }

        .brand-title {
          font-family: var(--font-serif-luxury);
          font-size: 1.05rem;
          letter-spacing: 0.12em;
          font-weight: 600;
        }

        .edition-badge {
          font-size: 0.65rem;
          letter-spacing: 0.15em;
          padding: 0.2rem 0.6rem;
          background: rgba(192, 146, 80, 0.2);
          border: 1px solid rgba(192, 146, 80, 0.4);
          color: #e5b978;
          border-radius: 2px;
        }

        .view-mode-selector {
          display: flex;
          background: rgba(0, 0, 0, 0.35);
          border-radius: 4px;
          padding: 2px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .mode-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.9rem;
          font-size: 0.8rem;
          font-weight: 500;
          color: rgba(253, 250, 246, 0.7);
          background: transparent;
          border: none;
          border-radius: 3px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .mode-btn:hover {
          color: #fff;
        }

        .mode-btn.active {
          background: #c09250;
          color: #1e1a17;
          font-weight: 600;
        }

        .toolbar-right {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tool-btn {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.5rem 1rem;
          font-size: 0.8rem;
          font-weight: 600;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }

        .btn-reset {
          background: rgba(255, 255, 255, 0.08);
          color: #fdfaf6;
          border: 1px solid rgba(255, 255, 255, 0.15);
        }

        .btn-reset:hover {
          background: rgba(255, 70, 70, 0.2);
          border-color: rgba(255, 70, 70, 0.4);
          color: #ff9999;
        }

        .btn-print {
          background: #c09250;
          color: #1e1a17;
        }

        .btn-print:hover {
          background: #d4a766;
        }

        /* Canvas & Page Formats (Editorial A4 / Magazine Proportion) */
        .catalog-canvas {
          margin: 2.5rem auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2.5rem;
          width: 100%;
          max-width: 1000px;
        }

        .catalog-canvas.mode-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          max-width: 1300px;
          padding: 0 1.5rem;
        }

        .catalog-canvas.mode-grid .editorial-page {
          transform: scale(1);
          min-height: 440px;
          height: auto;
          padding: 1.25rem;
          font-size: 65%;
          cursor: pointer;
        }

        .catalog-canvas.mode-grid .editorial-page:hover {
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.2);
          border-color: #c09250;
        }

        .editorial-page {
          width: 100%;
          max-width: 860px;
          min-height: 1180px;
          background: #ffffff;
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08), 0 2px 8px rgba(0, 0, 0, 0.04);
          border-radius: 3px;
          padding: 4rem 4.5rem;
          position: relative;
          box-sizing: border-box;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border: 1px solid rgba(0, 0, 0, 0.04);
        }

        .editorial-page.hidden-page {
          display: none !important;
        }

        .page-inner {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          min-height: 1050px;
        }

        /* Headers & Footers */
        .page-top-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: 0.85rem;
          margin-bottom: 2rem;
          font-size: 0.72rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: var(--color-accent-gold);
          font-weight: 600;
        }

        .page-header-brand {
          font-family: var(--font-serif-luxury);
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .page-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top: 1px solid var(--color-border-subtle);
          padding-top: 1rem;
          margin-top: 2rem;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--color-text-muted);
        }

        .footer-page-num {
          font-family: var(--font-serif-luxury);
          font-weight: 600;
          font-size: 0.95rem;
          color: var(--color-text-main);
        }

        /* Typography Presets */
        .section-eyebrow {
          display: block;
          font-size: 0.72rem;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-accent-gold);
          font-weight: 600;
          margin-bottom: 0.5rem;
        }

        .editorial-heading {
          font-family: var(--font-serif-luxury);
          font-size: 2.3rem;
          font-weight: 400;
          line-height: 1.18;
          color: var(--color-text-main);
          margin: 0 0 1.25rem 0;
          letter-spacing: -0.01em;
        }

        .editorial-heading em {
          font-style: italic;
          font-weight: 400;
          color: #7d6343;
        }

        .editorial-paragraph {
          font-size: 0.92rem;
          line-height: 1.75;
          color: var(--color-text-muted);
          margin-bottom: 1.5rem;
          text-align: justify;
        }

        .section-title-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2rem;
          margin-bottom: 2rem;
          border-bottom: 1px solid var(--color-border-subtle);
          padding-bottom: 1.25rem;
        }

        .title-desc-right {
          max-width: 340px;
          text-align: right;
        }

        .title-desc-right p {
          font-size: 0.84rem;
          line-height: 1.5;
          color: var(--color-text-muted);
          margin: 0 0 0.4rem 0;
        }

        .custom-tag {
          display: inline-block;
          font-size: 0.68rem;
          letter-spacing: 0.15em;
          font-weight: 600;
          color: var(--color-accent-gold);
          text-transform: uppercase;
        }

        /* Frame & Image Placeholder Styling */
        .editorial-frame {
          position: relative;
          background: #fbf9f6;
          border: 1.5px dashed rgba(192, 146, 80, 0.4);
          border-radius: 4px;
          overflow: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.25s ease;
          width: 100%;
        }

        .editorial-frame:hover {
          border-color: var(--color-accent-gold);
          background: #f7f3ed;
          box-shadow: 0 6px 18px rgba(192, 146, 80, 0.12);
        }

        .editorial-frame.has-image {
          border: 1px solid rgba(0, 0, 0, 0.08);
          background: #000;
        }

        .frame-placeholder-content {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1.5rem;
          color: var(--color-text-muted);
          pointer-events: none;
        }

        .placeholder-icon {
          color: var(--color-accent-gold);
          margin-bottom: 0.6rem;
          opacity: 0.85;
        }

        .placeholder-label {
          font-family: var(--font-serif-luxury);
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--color-text-main);
          margin: 0 0 0.25rem 0;
        }

        .placeholder-hint {
          font-size: 0.7rem;
          letter-spacing: 0.04em;
          color: #9c8e84;
        }

        .frame-image-wrapper {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .frame-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .frame-actions {
          position: absolute;
          top: 8px;
          right: 8px;
          display: flex;
          gap: 6px;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .editorial-frame:hover .frame-actions {
          opacity: 1;
        }

        .frame-btn {
          background: rgba(30, 26, 23, 0.85);
          color: #fdfaf6;
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          padding: 4px 8px;
          font-size: 0.72rem;
          cursor: pointer;
          backdrop-filter: blur(4px);
        }

        .frame-btn-remove {
          font-size: 1rem;
          line-height: 1;
          padding: 2px 7px;
          background: rgba(180, 40, 40, 0.85);
        }

        /* Specific Page Layouts */

        /* PÁGINA 1: PORTADA */
        .cover-page {
          background: #1a1614;
          color: #fdfaf6;
          border: 1px solid rgba(192, 146, 80, 0.3);
        }

        .cover-page .editorial-frame {
          background: #25201c;
          border-color: rgba(192, 146, 80, 0.5);
        }

        .cover-page .placeholder-label {
          color: #fdfaf6;
        }

        .cover-page .placeholder-hint {
          color: #c09250;
        }

        .cover-layout {
          justify-content: space-between;
        }

        .cover-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
          letter-spacing: 0.2em;
          color: #c09250;
        }

        .cover-rule {
          flex: 1;
          height: 1px;
          background: rgba(192, 146, 80, 0.3);
          margin: 0 1.5rem;
        }

        .cover-titles {
          margin: 2.5rem 0 1.5rem 0;
          text-align: center;
        }

        .cover-main-title {
          font-family: var(--font-serif-luxury);
          font-size: 3.2rem;
          letter-spacing: 0.12em;
          line-height: 1.12;
          font-weight: 400;
          color: #ffffff;
          margin: 0 0 1rem 0;
        }

        .serif-highlight {
          color: #c09250;
          font-style: italic;
          letter-spacing: 0.08em;
        }

        .cover-subtitle {
          font-size: 1.05rem;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: #d1c7bc;
          margin: 0;
          font-weight: 300;
        }

        .cover-hero-slot {
          width: 100%;
          margin: 1rem 0;
        }

        .cover-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          border-top: 1px solid rgba(192, 146, 80, 0.3);
          padding-top: 1.5rem;
          font-size: 0.72rem;
          letter-spacing: 0.15em;
          color: #a89a8c;
        }

        .cover-seal {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
          color: #c09250;
          font-weight: 600;
        }

        /* PÁGINA 2: ÍNDICE */
        .editorial-split-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3.5rem;
          margin: 1.5rem 0;
        }

        .dropcap {
          float: left;
          font-family: var(--font-serif-luxury);
          font-size: 4.2rem;
          line-height: 0.8;
          padding-top: 4px;
          padding-right: 12px;
          padding-bottom: 2px;
          color: var(--color-accent-gold);
        }

        .editorial-lead-dropcap {
          font-size: 1rem;
          line-height: 1.7;
          color: var(--color-text-main);
          margin-bottom: 1.25rem;
        }

        .curator-signature {
          margin-top: 2rem;
          padding-top: 1rem;
          border-top: 1px solid var(--color-border-subtle);
        }

        .signature-title {
          font-family: var(--font-serif-luxury);
          font-size: 1.1rem;
          font-weight: 600;
          margin: 0;
        }

        .signature-role {
          font-size: 0.75rem;
          letter-spacing: 0.1em;
          color: var(--color-text-muted);
          margin: 0;
          text-transform: uppercase;
        }

        .index-list {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 1.1rem;
        }

        .index-item {
          display: flex;
          align-items: baseline;
          gap: 1.25rem;
          padding-bottom: 0.75rem;
          border-bottom: 1px dashed rgba(44, 26, 14, 0.1);
          cursor: pointer;
          transition: transform 0.2s;
        }

        .index-item:hover {
          transform: translateX(4px);
        }

        .index-num {
          font-family: var(--font-serif-luxury);
          font-size: 1.3rem;
          color: var(--color-accent-gold);
          font-weight: 600;
        }

        .index-content strong {
          display: block;
          font-size: 0.88rem;
          color: var(--color-text-main);
        }

        .index-content small {
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        /* PÁGINA 3: FILOSOFÍA */
        .content-grid-2col-asym {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          gap: 3rem;
          align-items: start;
        }

        .manifesto-box {
          background: #faf7f2;
          border-left: 3px solid var(--color-accent-gold);
          padding: 1.25rem 1.5rem;
          margin: 1.25rem 0 1.5rem 0;
        }

        .manifesto-quote {
          font-family: var(--font-serif-luxury);
          font-style: italic;
          font-size: 1.05rem;
          line-height: 1.5;
          color: var(--color-text-main);
          margin: 0;
        }

        .pillars-grid {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        .pillar-card {
          padding: 0.85rem 1.25rem;
          border: 1px solid var(--color-border-subtle);
          border-radius: 3px;
        }

        .pillar-num {
          font-size: 0.7rem;
          letter-spacing: 0.2em;
          color: var(--color-accent-gold);
          font-weight: 700;
        }

        .pillar-card h4 {
          margin: 0.2rem 0 0.25rem 0;
          font-size: 0.92rem;
          font-weight: 600;
        }

        .pillar-card p {
          margin: 0;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          line-height: 1.45;
        }

        .photo-caption {
          font-size: 0.72rem;
          color: var(--color-text-muted);
          margin-top: 0.6rem;
          font-style: italic;
          text-align: center;
        }

        /* PÁGINA 4: MATERIALES */
        .center-header-block {
          text-align: center;
          max-width: 600px;
          margin: 0 auto 2.5rem auto;
        }

        .editorial-heading-center {
          font-family: var(--font-serif-luxury);
          font-size: 2.2rem;
          font-weight: 400;
          margin: 0.25rem 0 0.75rem 0;
        }

        .editorial-sub-center {
          font-size: 0.88rem;
          color: var(--color-text-muted);
          line-height: 1.6;
          margin: 0;
        }

        .dual-photo-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
          margin-bottom: 2rem;
        }

        .photo-detail-text h4 {
          font-family: var(--font-serif-luxury);
          font-size: 1.05rem;
          margin: 0.75rem 0 0.25rem 0;
        }

        .photo-detail-text p {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin: 0;
          line-height: 1.45;
        }

        .wood-spec-strip {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          padding: 1.25rem;
          background: #faf7f2;
          border-radius: 4px;
        }

        .spec-name {
          display: block;
          font-size: 0.75rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-accent-gold);
          margin-bottom: 0.25rem;
        }

        .spec-desc {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        /* PÁGINA 5: ASYMMETRIC 3-GRID */
        .asymmetric-3grid {
          display: grid;
          grid-template-columns: 1.15fr 1fr;
          gap: 1.75rem;
        }

        .grid-stacked-col {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        /* PÁGINA 6: SALAS WIDE */
        .editorial-split-wide {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .dual-detail-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .detail-card h4 {
          font-family: var(--font-serif-luxury);
          font-size: 1.05rem;
          margin: 0.75rem 0 0.25rem 0;
        }

        .detail-card p {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin: 0;
        }

        /* PÁGINA 7: COMEDORES OVERLAPPING */
        .overlapping-dining-layout {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        .dining-accents-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .dining-accent-card {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .dining-accent-card span {
          font-size: 0.8rem;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: var(--color-text-muted);
          margin-top: 0.6rem;
          font-weight: 500;
        }

        /* PÁGINA 8: SPLIT 50/50 */
        .split-grid-50-50 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2.5rem;
        }

        .product-desc-box {
          margin-top: 1rem;
        }

        .product-category {
          display: block;
          font-size: 0.7rem;
          letter-spacing: 0.18em;
          color: var(--color-accent-gold);
          font-weight: 600;
        }

        .product-desc-box h3 {
          font-family: var(--font-serif-luxury);
          font-size: 1.25rem;
          margin: 0.25rem 0 0.5rem 0;
        }

        .product-desc-box p {
          font-size: 0.82rem;
          color: var(--color-text-muted);
          line-height: 1.55;
          margin: 0;
        }

        /* PÁGINA 9: SQUARE 4-GRID */
        .square-4grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 2rem;
        }

        .grid-cell {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .cell-label {
          font-size: 0.78rem;
          letter-spacing: 0.05em;
          color: var(--color-text-muted);
          font-weight: 500;
        }

        /* PÁGINA 10: CLOSETS */
        .stacked-detail-images {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          margin-top: 1.5rem;
        }

        .mini-photo-item small {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.35rem;
        }

        /* PÁGINA 11: TRIPLET */
        .triplet-photo-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
        }

        .triplet-card h4 {
          font-family: var(--font-serif-luxury);
          font-size: 1rem;
          margin: 0.6rem 0 0.25rem 0;
        }

        .triplet-card p {
          font-size: 0.78rem;
          color: var(--color-text-muted);
          line-height: 1.45;
          margin: 0;
        }

        /* PÁGINA 12: CONTRAPORTADA */
        .back-cover {
          background: #1a1614;
          color: #fdfaf6;
          border: 1px solid rgba(192, 146, 80, 0.3);
        }

        .back-cover-layout {
          justify-content: space-between;
          text-align: center;
        }

        .back-cover-top {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }

        .back-cover-badge {
          font-family: var(--font-serif-luxury);
          font-size: 1.1rem;
          letter-spacing: 0.2em;
          color: #c09250;
        }

        .back-cover-line {
          width: 60px;
          height: 1px;
          background: #c09250;
        }

        .back-cover-pretitle {
          display: block;
          font-size: 0.75rem;
          letter-spacing: 0.25em;
          color: #c09250;
          margin-bottom: 0.75rem;
        }

        .back-cover-title {
          font-family: var(--font-serif-luxury);
          font-size: 2.8rem;
          line-height: 1.15;
          font-weight: 400;
          margin: 0 0 2.5rem 0;
        }

        .back-cover-title em {
          font-style: italic;
          color: #e5b978;
        }

        .back-cover-conditions {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          max-width: 580px;
          margin: 0 auto 2.5rem auto;
          text-align: left;
        }

        .condition-pill {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.08);
          padding: 1rem 1.5rem;
          border-radius: 4px;
        }

        .condition-pill.highlight-pill {
          background: rgba(192, 146, 80, 0.08);
          border-color: rgba(192, 146, 80, 0.4);
        }

        .pill-icon {
          font-size: 1.4rem;
          color: #c09250;
        }

        .pill-text strong {
          display: block;
          font-size: 0.92rem;
          color: #fdfaf6;
          margin-bottom: 0.15rem;
        }

        .pill-text span {
          font-size: 0.78rem;
          color: #b5a89b;
        }

        .back-cover-whatsapp-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          background: #25d366;
          color: #0b2212;
          font-weight: 700;
          font-size: 0.95rem;
          padding: 1rem 2rem;
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(37, 211, 102, 0.25);
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .back-cover-whatsapp-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(37, 211, 102, 0.35);
          background: #2ef377;
        }

        .contact-info-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1.5rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
          padding-top: 1.5rem;
          margin-top: 2rem;
          text-align: center;
        }

        .contact-info-grid small {
          display: block;
          font-size: 0.65rem;
          letter-spacing: 0.18em;
          color: #c09250;
          margin-bottom: 0.25rem;
        }

        .contact-info-grid p {
          font-size: 0.8rem;
          color: #dfd7ce;
          margin: 0;
        }

        .back-cover-copyright {
          font-size: 0.7rem;
          color: #8a7c70;
          margin-top: 1.5rem;
        }

        /* Floating Slider Navigator */
        .catalog-slider-nav {
          position: fixed;
          bottom: 1.5rem;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(30, 26, 23, 0.95);
          backdrop-filter: blur(12px);
          padding: 0.6rem 1.25rem;
          border-radius: 50px;
          border: 1px solid rgba(192, 146, 80, 0.35);
          box-shadow: 0 12px 36px rgba(0, 0, 0, 0.4);
        }

        .nav-arrow-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.08);
          color: #fdfaf6;
          border: 1px solid rgba(255, 255, 255, 0.15);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s;
        }

        .nav-arrow-btn:hover:not(:disabled) {
          background: #c09250;
          color: #1e1a17;
          border-color: #c09250;
        }

        .nav-arrow-btn:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }

        .slider-pages-strip {
          display: flex;
          gap: 0.4rem;
        }

        .page-pill-btn {
          background: transparent;
          border: none;
          color: rgba(253, 250, 246, 0.6);
          font-size: 0.8rem;
          font-weight: 500;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .page-pill-btn:hover {
          color: #ffffff;
        }

        .page-pill-btn.active {
          background: #c09250;
          color: #1e1a17;
          font-weight: 700;
        }

        /* Image Picker Modal */
        .image-picker-modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2000;
          background: rgba(0, 0, 0, 0.75);
          backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2rem;
        }

        .image-picker-modal {
          background: #25201c;
          border: 1px solid rgba(192, 146, 80, 0.3);
          border-radius: 8px;
          width: 100%;
          max-width: 900px;
          max-height: 85vh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          box-shadow: 0 24px 60px rgba(0, 0, 0, 0.6);
          color: #fdfaf6;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .modal-tag {
          font-size: 0.68rem;
          letter-spacing: 0.2em;
          color: #c09250;
          font-weight: 600;
        }

        .modal-title {
          font-family: var(--font-serif-luxury);
          font-size: 1.35rem;
          margin: 0.25rem 0 0 0;
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          font-size: 1.8rem;
          color: rgba(255, 255, 255, 0.5);
          cursor: pointer;
          line-height: 1;
        }

        .modal-close-btn:hover {
          color: #fff;
        }

        .modal-upload-bar {
          padding: 1rem 2rem;
          background: rgba(0, 0, 0, 0.25);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .upload-cta {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .upload-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          background: #c09250;
          color: #1e1a17;
          font-weight: 600;
          padding: 0.55rem 1.15rem;
          border-radius: 4px;
          border: none;
          cursor: pointer;
          font-size: 0.85rem;
          transition: background 0.2s;
        }

        .upload-btn:hover {
          background: #d4a766;
        }

        .upload-tip {
          font-size: 0.8rem;
          color: #a89a8c;
        }

        .gallery-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding: 0.75rem 2rem;
          background: rgba(0, 0, 0, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        }

        .gallery-tab-btn {
          padding: 0.4rem 0.8rem;
          border-radius: 3px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: transparent;
          color: #d1c7bc;
          font-size: 0.75rem;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s;
        }

        .gallery-tab-btn.active {
          background: #c09250;
          color: #1e1a17;
          border-color: #c09250;
          font-weight: 600;
        }

        .modal-photos-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
          gap: 0.75rem;
          padding: 1.5rem 2rem;
          overflow-y: auto;
          max-height: 420px;
        }

        .modal-photo-item {
          position: relative;
          aspect-ratio: 4/3;
          border-radius: 4px;
          overflow: hidden;
          cursor: pointer;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal-photo-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s;
        }

        .photo-select-overlay {
          position: absolute;
          inset: 0;
          background: rgba(192, 146, 80, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #1e1a17;
          font-weight: 700;
          font-size: 0.75rem;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .modal-photo-item:hover img {
          transform: scale(1.08);
        }

        .modal-photo-item:hover .photo-select-overlay {
          opacity: 1;
        }

        /* PRINT STYLES (Exact 12-page PDF magazine output) */
        @media print {
          body,
          html,
          .catalog-presentation-container {
            background: #ffffff !important;
            padding: 0 !important;
            margin: 0 !important;
            color: #000000 !important;
          }

          .no-print {
            display: none !important;
          }

          .catalog-canvas {
            margin: 0 !important;
            padding: 0 !important;
            gap: 0 !important;
            max-width: 100% !important;
            display: block !important;
          }

          .editorial-page {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
            min-height: 100vh !important;
            height: 100vh !important;
            page-break-after: always !important;
            page-break-inside: avoid !important;
            break-after: page !important;
            box-shadow: none !important;
            border: none !important;
            padding: 3.5rem 4rem !important;
          }

          .cover-page,
          .back-cover {
            background: #1a1614 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          .editorial-frame.is-empty {
            border: 1px dashed #cccccc !important;
            background: #fcfcfc !important;
          }

          .frame-actions {
            display: none !important;
          }
        }

        /* Responsive Mobile Layouts */
        @media (max-width: 768px) {
          .catalog-toolbar {
            padding: 0.75rem 1rem;
            flex-wrap: wrap;
            gap: 0.75rem;
          }
          .toolbar-center {
            order: 3;
            width: 100%;
            display: flex;
            justify-content: center;
          }
          .editorial-page {
            padding: 2rem 1.25rem;
            min-height: auto;
          }
          .page-inner {
            min-height: auto;
          }
          .cover-main-title {
            font-size: 2.1rem;
          }
          .editorial-split-grid,
          .content-grid-2col-asym,
          .dual-photo-grid,
          .asymmetric-3grid,
          .dual-detail-row,
          .split-grid-50-50,
          .square-4grid,
          .triplet-photo-grid,
          .contact-info-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }
          .grid-stacked-col {
            gap: 1rem;
          }
          .section-title-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.75rem;
          }
          .title-desc-right {
            text-align: left;
            max-width: 100%;
          }
          .catalog-slider-nav {
            bottom: 0.75rem;
            padding: 0.5rem 0.8rem;
            max-width: 92vw;
          }
          .slider-pages-strip {
            overflow-x: auto;
            max-width: 65vw;
          }
        }
      `}</style>
    </div>
  );
}
