'use client';
import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { GALLERIES } from '../lib/GalleryData';

interface GalleryModalProps {
  galleryKey: string | null;
  onClose: () => void;
}

export default function GalleryModal({ galleryKey, onClose }: GalleryModalProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (galleryKey) {
      // First, trigger the CSS visibility and expansion
      setIsVisible(true);
      
      // Then, wait a bit for the DOM to update max-height before scrolling
      const timer = setTimeout(() => {
        const panel = document.getElementById('galleryPanel');
        if (panel) {
          const y = panel.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }, 150);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [galleryKey]);

  const data = galleryKey ? GALLERIES[galleryKey] : null;

  const openLightbox = (index: number) => setLightboxIndex(index);
  const closeLightbox = () => setLightboxIndex(null);

  const prevImage = () => {
    if (lightboxIndex !== null && data) {
      setLightboxIndex((prev) => (prev! - 1 + data.images.length) % data.images.length);
    }
  };

  const nextImage = () => {
    if (lightboxIndex !== null && data) {
      setLightboxIndex((prev) => (prev! + 1) % data.images.length);
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, data]);

  const handlePrevClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    prevImage();
  };

  const handleNextClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    nextImage();
  };

  if (!data) return null;

  return (
    <>
      <div className="gallery-panel gallery-panel--open" id="galleryPanel" aria-hidden="false" style={{ padding: '2rem 0' }}>
        <div className="gallery-panel-inner">
          <div className="gallery-panel-header">
            <div>
              <p className="gallery-panel-label">Colección</p>
              <h3 className="gallery-panel-title">{data.title}</h3>
            </div>
            <button className="gallery-close" onClick={onClose} aria-label="Cerrar galería">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="gallery-grid">
            {data.images.map((img: any, i: number) => (
              <div
                key={i}
                className={`gallery-item ${isVisible ? 'gallery-item--visible' : ''}`}
                style={{ transitionDelay: `${i * 0.02}s` }}
                tabIndex={0}
                role="button"
                onClick={() => openLightbox(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') openLightbox(i);
                }}
              >
                {img.src.endsWith('.mp4') ? (
                  <>
                    <video src={`/${img.src}`} muted playsInline preload="metadata" className="gallery-video-thumb"></video>
                    <div className="gallery-item-overlay">
                      <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="12" cy="12" r="11" fill="rgba(44,26,14,0.7)"/>
                        <polygon points="10,8 18,12 10,16" fill="#C09250"/>
                      </svg>
                    </div>
                  </>
                ) : (
                  <>
                    <Image src={`/${img.src}`} alt={img.alt} loading="lazy" fill sizes="(max-width: 768px) 33vw, 20vw" style={{ objectFit: "cover" }} />
                    <div className="gallery-item-overlay">
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                      </svg>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="gallery-panel-footer">
            <button className="collections-cta-btn" onClick={() => document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' })}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Consultar por WhatsApp
            </button>
          </div>
        </div>
      </div>

      {lightboxIndex !== null && typeof document !== 'undefined' && createPortal(
        <div className="lightbox lightbox--open" id="lightbox" aria-hidden="false" onClick={closeLightbox}>
          <div className="lightbox-backdrop"></div>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <button className="lightbox-close" onClick={closeLightbox} aria-label="Cerrar">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
            <button className="lightbox-nav lightbox-prev" onClick={prevImage} aria-label="Anterior">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
            <div className="lightbox-media-wrapper">
              {data.images[lightboxIndex].src.endsWith('.mp4') ? (
                <video key={lightboxIndex} src={`/${data.images[lightboxIndex].src}`} className="lightbox-video lightbox-animate-change" style={{ maxWidth: '100%', maxHeight: '100%' }} controls autoPlay playsInline></video>
              ) : (
                <Image key={lightboxIndex} src={`/${data.images[lightboxIndex].src}`} alt={data.images[lightboxIndex].alt} className="lightbox-img lightbox-animate-change" fill sizes="100vw" style={{ objectFit: "contain" }} priority />
              )}
            </div>
            <button className="lightbox-nav lightbox-next" onClick={nextImage} aria-label="Siguiente">
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
            <div className="lightbox-counter">
              {lightboxIndex + 1} / {data.images.length}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
