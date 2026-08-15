'use client';

import { useState, useEffect } from 'react';

export default function CatalogSection() {
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState('');
  const [whatsapp, setWhatsapp] = useState('');

  useEffect(() => {
    document.body.style.overflow = showModal ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const handleSubmit = () => {
    const message = encodeURIComponent(
      `Hola, soy ${nombre}. Mi número es ${whatsapp}. Me gustaría recibir el Catálogo 2026.`
    );
    window.open(`https://wa.me/593995795486?text=${message}`, '_blank');
    setShowModal(false);
  };

  return (
    <section className="catalog-section">
      <div className="catalog-icon reveal">
        <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
          <polyline points="10 9 9 9 8 9" />
        </svg>
      </div>
      <h2 className="reveal">
        Descarga nuestro <em>Catálogo 2026</em>
      </h2>
      <p className="reveal">
        Más de 200 diseños exclusivos en un solo documento. Inspírate y encuentra el mueble perfecto para tu hogar.
      </p>
      <button className="catalog-btn reveal" onClick={() => setShowModal(true)}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
          <polyline points="7 10 12 15 17 10"/>
          <line x1="12" y1="15" x2="12" y2="3"/>
        </svg>
        Descargar Catálogo PDF
      </button>

      <div className={`catalog-modal-overlay${showModal ? ' open' : ''}`} onClick={() => setShowModal(false)}>
        <div className="catalog-modal" onClick={(e) => e.stopPropagation()}>
          <button className="catalog-modal-close" onClick={() => setShowModal(false)} aria-label="Cerrar">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
          <h3>Recibe el Catálogo 2026</h3>
          <p>Déjanos tu nombre y WhatsApp y te lo enviamos al instante.</p>
          <div className="field">
            <label htmlFor="catNombre">Tu nombre</label>
            <input
              type="text"
              id="catNombre"
              placeholder="Ej: Maria Garcia"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="catWhatsapp">Tu WhatsApp</label>
            <input
              type="tel"
              id="catWhatsapp"
              placeholder="+593 99 123 4567"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>
          <button className="catalog-btn" style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem' }} onClick={handleSubmit}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" style={{ marginRight: '8px' }}>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Enviar y recibir catálogo
          </button>
        </div>
      </div>
    </section>
  );
}
