'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { GALLERIES } from '@/lib/GalleryData';
import Navbar from '@/components/Navbar';
import GalleryModal from '@/components/GalleryModal';
import CotizadorAlgoritmico from '@/components/CotizadorAlgoritmico';
import BeforeAfter from '@/components/BeforeAfter';
import FAQ from '@/components/FAQ';
import Testimonials from '@/components/Testimonials';
import WhatsAppContactForm from '@/components/WhatsAppContactForm';
import WhatsAppFloat from '@/components/WhatsAppFloat';

export default function HomePage() {
  const [galleryKey, setGalleryKey] = useState<string | null>(null);

  const openGallery = (key: string) => {
    setGalleryKey(key);
  };

  const closeGallery = () => {
    setGalleryKey(null);
  };

  useEffect(() => {
    const revealTargets = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window && revealTargets.length) {
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12 });
      revealTargets.forEach((el) => revealObserver.observe(el));
      return () => {
        revealObserver.disconnect();
      };
    } else {
      revealTargets.forEach((el) => el.classList.add('revealed'));
    }
  }, []);

  return (
    <>
      <Navbar />

      <main>
        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <p className="hero-eyebrow">Diseño · Calidad · Estilo</p>
            <h1 className="hero-title">Muebles que <em>cuentan</em> tu historia</h1>
            <p className="hero-sub">Cada espacio merece una pieza única. Descubre nuestra colección artesanal de muebles diseñados para perdurar.</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div className="hero-actions">
                <button className="hero-btn" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  Solicitar asesoría gratuita
                </button>
                <a href="/catalogo" className="hero-btn" style={{ background: 'var(--espresso)', border: '1px solid var(--gold)', color: 'var(--gold)', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="18" rx="2"/>
                    <path d="M12 3v18"/>
                  </svg>
                  Catálogo Editorial (12 Págs)
                </a>
                <a href="#colecciones" className="hero-btn-outline">Ver colecciones</a>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(44, 26, 14, 0.55)', margin: '0.25rem 0 0 0', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
                Reserva hoy con el 50% y cancela el saldo al ver tu mueble instalado.
              </p>
            </div>
            
            <div className="hero-stats trust-bar" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.25rem', marginTop: '2.5rem' }}>
              <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--espresso)', lineHeight: 1.2 }}>Garantía Total</strong>
                  <span style={{ fontSize: '11px', color: 'rgba(44, 26, 14, 0.7)' }}>1 año contra defectos</span>
                </div>
              </div>
              
              <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--espresso)', lineHeight: 1.2 }}>Madera Certificada</strong>
                  <span style={{ fontSize: '11px', color: 'rgba(44, 26, 14, 0.7)' }}>Calidad premium</span>
                </div>
              </div>

              <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--espresso)', lineHeight: 1.2 }}>+15 Años Experiencia</strong>
                  <span style={{ fontSize: '11px', color: 'rgba(44, 26, 14, 0.7)' }}>+500 clientes felices</span>
                </div>
              </div>

              <div className="stat" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="3" width="15" height="13"/>
                  <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/>
                  <circle cx="5.5" cy="18.5" r="2.5"/>
                  <circle cx="18.5" cy="18.5" r="2.5"/>
                </svg>
                <div>
                  <strong style={{ display: 'block', fontSize: '13px', color: 'var(--espresso)', lineHeight: 1.2 }}>Instalación Gratis</strong>
                  <span style={{ fontSize: '11px', color: 'rgba(44, 26, 14, 0.7)', lineHeight: 1.1 }}>Ambato, Riobamba, Latacunga, Puyo</span>
                </div>
              </div>
            </div>
          </div>
          <div className="hero-right">
            <div className="hero-img-container">
              <Image src="/presentacion/hero_sala.png" sizes="100vw" alt="Sala de estar con muebles Mesias" loading="eager" width={600} height={450} decoding="async" />
              <div className="hero-img-badge">
                <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
                  <circle cx="5" cy="5" r="5" fill="#25D366" />
                </svg>
                Envío a todo Ecuador
              </div>
            </div>
          </div>
        </section>

        {/* COLECCIONES */}
        <section className="collections" id="colecciones">
          <div className="collections-header">
            <p className="section-label">Nuestras colecciones</p>
            <h2 className="section-title">Piezas pensadas para ti</h2>
            <p className="section-sub">Haz clic en cualquier colección para ver las fotos. Artesanía y diseño en cada detalle.</p>
          </div>

          <div className="cards-grid">
            {/* SALA */}
            <article className="card" tabIndex={0} onClick={() => openGallery('sala')}>
              <div className="card-img">
                <Image src="/img/salaysofas/111.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Colección Sala y Sofás" loading="lazy" width={400} height={300}  />
                {GALLERIES['sala']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['sala'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Sala & Sofás</p>
                <p className="card-desc">Diseños modernos y clásicos para hacer de tu sala el espacio que mereces.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['sala']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['sala']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* DORMITORIO */}
            <article className="card" tabIndex={0} onClick={() => openGallery('dormitorio')}>
              <div className="card-img">
                <Image src="/img/dormitorio/1.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Colección Dormitorio" loading="lazy" width={400} height={300}  />
                {GALLERIES['dormitorio']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['dormitorio'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Dormitorio</p>
                <p className="card-desc">Camas, armarios y veladores con acabados en maderas nobles.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['dormitorio']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['dormitorio']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* COMEDOR */}
            <article className="card" tabIndex={0} onClick={() => openGallery('comedor')}>
              <div className="card-img">
                <Image src="/img/comedor/11.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Colección Comedor" loading="lazy" width={400} height={300}  />
                {GALLERIES['comedor']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['comedor'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Comedor</p>
                <p className="card-desc">Mesas y sillas para reuniones que se convierten en recuerdos.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['comedor']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['comedor']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* CLOSET */}
            <article className="card" tabIndex={0} onClick={() => openGallery('closet')}>
              <div className="card-img">
                <Image src="/img/closet/49.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Closets a medida" loading="lazy" width={400} height={300}  />
                {GALLERIES['closet']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['closet'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Closet</p>
                <p className="card-desc">Closets a medida con diseño personalizado, máximo aprovechamiento del espacio.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['closet']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['closet']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* ESPEJOS */}
            <article className="card" tabIndex={0} onClick={() => openGallery('espejos')}>
              <div className="card-img">
                <Image src="/img/espejos/208.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Espejos decorativos" loading="lazy" width={400} height={300}  />
                {GALLERIES['espejos']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['espejos'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Espejos</p>
                <p className="card-desc">Espejos con marcos artesanales en madera para realzar cualquier ambiente del hogar.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['espejos']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['espejos']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* PUERTAS */}
            <article className="card" tabIndex={0} onClick={() => openGallery('puertas')}>
              <div className="card-img">
                <Image src="/img/puertas/54.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Puertas de madera" loading="lazy" width={400} height={300}  />
                {GALLERIES['puertas']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['puertas'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Puertas</p>
                <p className="card-desc">Puertas interiores y exteriores en madera maciza con acabados de primera calidad.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['puertas']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['puertas']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* OTRAS OPCIONES */}
            <article className="card" tabIndex={0} onClick={() => openGallery('otras')}>
              <div className="card-img">
                <Image src="/img/otrasopciones/16.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Otras opciones" loading="lazy" width={400} height={300}  />
                {GALLERIES['otras']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['otras'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Otras opciones</p>
                <p className="card-desc">Repisas, mesas auxiliares, muebles de TV y más piezas para completar tu hogar.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['otras']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['otras']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* BANIO */}
            <article className="card" tabIndex={0} onClick={() => openGallery('bano')}>
              <div className="card-img">
                <Image src="/img/bano/64.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Muebles de baño" loading="lazy" width={400} height={300}  />
                {GALLERIES['bano']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['bano'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Baño</p>
                <p className="card-desc">Muebles y accesorios para baño con acabados elegantes y funcionales.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['bano']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['bano']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* COCINAS */}
            <article className="card" tabIndex={0} onClick={() => openGallery('cocinas')}>
              <div className="card-img">
                <Image src="/img/cocinas/183.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Cocinas integrales" loading="lazy" width={400} height={300}  />
                {GALLERIES['cocinas']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['cocinas'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Cocinas</p>
                <p className="card-desc">Cocinas integrales y modulares a medida con acabados modernos y duraderos.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['cocinas']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['cocinas']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* OFICINA */}
            <article className="card" tabIndex={0} onClick={() => openGallery('oficina')}>
              <div className="card-img">
                <Image src="/img/oficina/100.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Muebles de oficina" loading="lazy" width={400} height={300}  />
                {GALLERIES['oficina']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['oficina'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Oficina</p>
                <p className="card-desc">Escritorios, libreros y muebles de oficina con diseño profesional y funcional.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['oficina']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['oficina']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* VENTANAS */}
            <article className="card" tabIndex={0} onClick={() => openGallery('ventanas')}>
              <div className="card-img">
                <Image src="/img/ventanas/26.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Ventanas de madera" loading="lazy" width={400} height={300}  />
                {GALLERIES['ventanas']?.precioDesde ? <div className="card-tag">Desde ${GALLERIES['ventanas'].precioDesde}</div> : <div className="card-tag">A cotizar</div>}
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Ventanas</p>
                <p className="card-desc">Ventanas artesanales en madera para interiores y exteriores con acabados premium.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {(GALLERIES['ventanas']?.images?.length || 0) <= 3 ? 'Diseño a medida' : `${GALLERIES['ventanas']?.images?.length} fotos`}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* PROCESO */}
            <article className="card" tabIndex={0} onClick={() => openGallery('proceso')}>
              <div className="card-img">
                <Image src="/img/proceso/157.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Proceso de fabricación" loading="lazy" width={400} height={300}  />
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  Ver galería
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Proceso de Fabricación</p>
                <p className="card-desc">Míranos trabajar. Cada pieza nace de manos expertas con materiales seleccionados.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    {GALLERIES['proceso']?.images?.length || 0} {GALLERIES['proceso']?.images?.length === 1 ? 'foto' : 'fotos'}
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>

            {/* VIDEOS */}
            <article className="card" tabIndex={0} onClick={() => openGallery('videosexibicion')}>
              <div className="card-img card-img--video">
                <video src="/img/videosexibicion/42.mp4" muted playsInline preload="metadata" className="card-cover-video"></video>
                <div className="card-tag">Video</div>
                <div className="card-overlay-hint">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21" />
                  </svg>
                  Ver videos
                </div>
              </div>
              <div className="card-body">
                <p className="card-name">Videos de Exhibición</p>
                <p className="card-desc">Mira nuestros muebles en acción. Videos reales de nuestras piezas en exhibición.</p>
                <div className="card-footer-row">
                  <span className="card-gallery-hint">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <rect x="3" y="3" width="18" height="18" rx="2" />
                      <path d="M3 9h18M9 21V9" />
                    </svg>
                    3 videos
                  </span>
                  <button className="card-cta" onClick={(e) => { e.stopPropagation(); document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' }) }}>
                    Cotizar mi diseño a medida <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
                  </button>
                </div>
              </div>
            </article>
          </div>

          <GalleryModal galleryKey={galleryKey} onClose={closeGallery} />
        </section>

        {/* Banner CTA */}
        <div className="collections-cta-banner">
          <div className="collections-cta-icon">
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
          </div>
          <div className="collections-cta-text">
            <p className="collections-cta-title">¿No encontraste lo que buscabas?</p>
            <p className="collections-cta-sub">Escríbenos y lo hacemos posible. Fabricamos piezas únicas a tu medida y gusto.</p>
          </div>
          <button className="collections-cta-btn" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Escríbenos ahora
          </button>
        </div>

        {/* NOSOTROS */}
        <section className="why-us" id="nosotros">
          <div className="why-header">
            <p className="section-label">Por qué Línea de Muebles Mesías?</p>
            <h2 className="section-title light">Calidad que se siente</h2>
          </div>
          <div className="why-grid">
            <div className="why-item reveal">
              <div className="why-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <h3>Materiales premium</h3>
              <p>Solo usamos maderas certificadas y tapizados de alta resistencia seleccionados con criterio.</p>
            </div>
            <div className="why-item reveal reveal-delay-1">
              <div className="why-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" />
                </svg>
              </div>
              <h3>Fabricación artesanal</h3>
              <p>Cada pieza es trabajada a mano por nuestros maestros con más de 15 años de experiencia.</p>
            </div>
            <div className="why-item reveal reveal-delay-2">
              <div className="why-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                  <polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
              <h3>Entrega a domicilio</h3>
              <p>Llevamos tus muebles hasta tu hogar y los instalamos sin costo adicional dentro de la ciudad.</p>
            </div>
            <div className="why-item reveal reveal-delay-3">
              <div className="why-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <h3>Garantía incluida</h3>
              <p>Todos nuestros muebles cuentan con garantía de 1 año contra defectos de fabricación.</p>
            </div>
          </div>
        </section>

        {/* PROCESO */}
        <section className="process-section" id="proceso">
          <div className="collections-header">
            <p className="section-label">Así trabajamos</p>
            <h2 className="section-title">Nuestro Proceso</h2>
            <p className="section-sub">Cada mueble atraviesa un riguroso proceso artesanal. Desde el diseño hasta tu hogar.</p>
          </div>
          <div className="process-timeline">
            <div className="process-step reveal">
              <div className="process-step-num">01</div>
              <Image src="/img/proceso/223.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Diseño personalizado" className="process-step-img" loading="lazy" width={400} height={300}  />
              <h3>Diseño Personalizado</h3>
              <p>Escuchamos tu idea y la convertimos en un plano a medida con materiales seleccionados.</p>
            </div>
            <div className="process-step reveal reveal-delay-1">
              <div className="process-step-num">02</div>
              <Image src="/img/proceso/157.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Fabricación artesanal" className="process-step-img" loading="lazy" width={400} height={300}  />
              <h3>Fabricación Artesanal</h3>
              <p>Nuestros maestros carpinteros dan vida a tu pieza con herramientas profesionales y maderas nobles.</p>
            </div>
            <div className="process-step reveal reveal-delay-2">
              <div className="process-step-num">03</div>
              <Image src="/img/proceso/225.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" alt="Entrega e instalación" className="process-step-img" loading="lazy" width={400} height={300}  />
              <h3>Entrega e Instalación</h3>
              <p>Llevamos tus muebles a domicilio, los instalamos y nos aseguramos de que todo quede perfecto.</p>
            </div>
          </div>
        </section>

        {/* ANTES Y DESPUES */}
        <BeforeAfter />

        {/* TESTIMONIOS */}
        <Testimonials />

        {/* FAQ */}
        <FAQ />

        {/* CONTACTO WHATSAPP */}
        <WhatsAppContactForm />

        {/* COTIZACION DETALLADA */}
        <section className="quote-section" id="cotizacion" style={{ padding: '4rem 2rem', background: 'var(--white)', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ width: '100%', maxWidth: '700px' }}>
            <CotizadorAlgoritmico />
          </div>
        </section>

        {/* FOOTER */}
        <footer>
          <div className="footer-top">
            <div className="footer-brand">
              <div className="logo">Línea de Muebles <span>Mesías</span></div>
              <p>Diseño con carácter desde Ecuador.</p>
            </div>
            <div className="footer-links">
              <strong>Navegación</strong>
              <a href="#colecciones">Colecciones</a>
              <a href="#nosotros">Nosotros</a>
              <a href="#contacto">Contacto</a>
            </div>
            <div className="footer-links">
              <strong>Categorías</strong>
              <a href="#colecciones">Sala &amp; Sofás</a>
              <a href="#colecciones">Dormitorio</a>
              <a href="#colecciones">Comedor</a>
              <a href="#colecciones">Clóset</a>
              <a href="#colecciones">Espejos</a>
              <a href="#colecciones">Puertas</a>
              <a href="#colecciones">Baño</a>
              <a href="#colecciones">Cocinas</a>
              <a href="#colecciones">Oficina</a>
              <a href="#colecciones">Ventanas</a>
              <a href="#colecciones">Otras opciones</a>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Línea de Muebles Mesías. Todos los derechos reservados.</p>
          </div>
        </footer>
      </main>

      {/* Botón flotante WhatsApp */}
      <WhatsAppFloat />
    </>
  );
}

// Trigger WSL flush
