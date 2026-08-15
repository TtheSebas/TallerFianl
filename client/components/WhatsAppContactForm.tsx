'use client';

import { useState } from 'react';

export default function WhatsAppContactForm() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [interes, setInteres] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const enviarWhatsApp = () => {
    const newErrors: Record<string, boolean> = {};
    if (!nombre.trim()) newErrors.nombre = true;
    if (!telefono.trim()) newErrors.telefono = true;
    if (!ciudad.trim()) newErrors.ciudad = true;
    if (!interes) newErrors.interes = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const text = `Hola! Soy ${nombre} de ${ciudad}.\n` +
      `Me interesa: ${interes}\n` +
      (mensaje ? `Mensaje: ${mensaje}\n` : '') +
      `Mi WhatsApp: ${telefono}`;
    window.open(`https://wa.me/593995795486?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-left">
        <h2>Hablemos por <em>WhatsApp</em></h2>
        <p>Déjanos tus datos y con un clic te conectamos directamente con nuestro asesor. Sin llamadas, sin formularios eternos.</p>
        <div className="contact-features">
          <div className="contact-feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            Respuesta en menos de 1 hora
          </div>
          <div className="contact-feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            Cotización sin compromiso
          </div>
          <div className="contact-feature">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#25D366" strokeWidth="2"><polyline points="20 6 9 17 4 12" /></svg>
            Asesoría personalizada gratis
          </div>
        </div>
        <div className="wa-badge">
          <div className="wa-dot"></div>
          Asesor disponible ahora
        </div>
      </div>
      <div className="form-card">
        <p className="form-title">Solicita información</p>
        <p className="form-sub">Te responderemos en menos de 1 hora</p>
        <div className="field-group">
          <div className={`field ${errors.nombre ? 'field--error' : ''}`}>
            <label htmlFor="nombre">Nombre completo</label>
            <input type="text" id="nombre" autoComplete="name" placeholder="Ej: María García" value={nombre} onChange={(e) => setNombre(e.target.value)} />
            <span className="err-msg" role="alert">Por favor ingresa tu nombre</span>
          </div>
          <div className={`field ${errors.telefono ? 'field--error' : ''}`}>
            <label htmlFor="telefono">Tu número de WhatsApp</label>
            <input type="tel" id="telefono" autoComplete="tel" placeholder="+593 99 123 4567" value={telefono} onChange={(e) => setTelefono(e.target.value)} />
            <span className="err-msg" role="alert">Ingresa un número válido</span>
          </div>
          <div className={`field ${errors.ciudad ? 'field--error' : ''}`}>
            <label htmlFor="ciudad">Ciudad</label>
            <input type="text" id="ciudad" autoComplete="address-level2" placeholder="Ej: Ambato" value={ciudad} onChange={(e) => setCiudad(e.target.value)} />
            <span className="err-msg" role="alert">Indica tu ciudad</span>
          </div>
          <div className={`field ${errors.interes ? 'field--error' : ''}`}>
            <label htmlFor="interes">¿Qué te interesa?</label>
            <select id="interes" value={interes} onChange={(e) => setInteres(e.target.value)}>
              <option value="">-- Selecciona una categoría --</option>
              <option>Sala & Sofás</option>
              <option>Dormitorio</option>
              <option>Comedor</option>
              <option>Closet</option>
              <option>Espejos</option>
              <option>Puertas</option>
              <option>Baño</option>
              <option>Cocinas</option>
              <option>Oficina</option>
              <option>Ventanas</option>
              <option>Otras opciones</option>
              <option>Otro / Consulta general</option>
            </select>
            <span className="err-msg" role="alert">Selecciona una categoría</span>
          </div>
          <div className="field">
            <label htmlFor="mensaje">Mensaje (opcional)</label>
            <textarea id="mensaje" maxLength={500} placeholder="Cuéntanos qué tienes en mente..." value={mensaje} onChange={(e) => setMensaje(e.target.value)} />
            <span className="char-count">{mensaje.length} / 500</span>
          </div>
        </div>
        <button className="wa-submit" onClick={enviarWhatsApp}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Enviar por WhatsApp
        </button>
        <p className="privacy-note">&#128274; Tus datos solo se usan para atenderte. No spam, nunca.</p>
      </div>
    </section>
  );
}
