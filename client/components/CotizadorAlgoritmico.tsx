'use client';

import { useState } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

type Ciudad = 'Ambato' | 'Riobamba' | 'Latacunga' | 'Puyo' | 'Quito' | 'Guayaquil' | 'Otro';
type Material = 'Melamina Premium' | 'MDF Pintado' | 'Madera Maciza (Seike/Colorada)';
type Espacio = 'Sala' | 'Dormitorio' | 'Cocina' | 'Oficina' | 'Baño' | 'Closet' | 'Otro';

export default function CotizadorAlgoritmico() {
  const [paso, setPaso] = useState(1);
  const [espacio, setEspacio] = useState<Espacio>('Sala');
  const [ancho, setAncho] = useState<number | ''>('');
  const [alto, setAlto] = useState<number | ''>('');
  const [profundidad, setProfundidad] = useState<number | ''>('');
  const [material, setMaterial] = useState<Material>('Melamina Premium');
  const [ciudad, setCiudad] = useState<Ciudad>('Ambato');
  
  // Cotización calculada
  const [precioEstimado, setPrecioEstimado] = useState<{ min: number; max: number } | null>(null);

  // Ciudades con envío e instalación gratis
  const ciudadesGratis = ['Ambato', 'Riobamba', 'Latacunga', 'Puyo'];

  const calcularPrecio = () => {
    // Cálculo algorítmico básico basado en volumen y material
    let vol = ((Number(ancho) || 100) * (Number(alto) || 100) * (Number(profundidad) || 50)) / 1000000; // m3
    if (vol < 0.5) vol = 0.5;

    let precioBaseMetro = 250; // Dólares por factor de volumen base
    
    if (material === 'MDF Pintado') precioBaseMetro += 150;
    if (material === 'Madera Maciza (Seike/Colorada)') precioBaseMetro += 400;
    
    if (espacio === 'Cocina') precioBaseMetro += 200; // Cocinas suelen ser más caras
    if (espacio === 'Closet') precioBaseMetro += 100;

    const basePrice = vol * precioBaseMetro;
    
    // Logística
    let recargoEnvio = 0;
    if (!ciudadesGratis.includes(ciudad)) {
      if (ciudad === 'Quito' || ciudad === 'Guayaquil') recargoEnvio = 80;
      else recargoEnvio = 50;
    }

    const totalMin = Math.round(basePrice * 0.9 + recargoEnvio);
    const totalMax = Math.round(basePrice * 1.15 + recargoEnvio);

    setPrecioEstimado({ min: totalMin, max: totalMax });
    setPaso(4);
  };

  const generarPDF = () => {
    if (!precioEstimado) return;
    
    const doc = new jsPDF();
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('Línea de Muebles Mesías', 14, 22);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text('Proforma / Presupuesto Estimado - Régimen RIMPE', 14, 30);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 14, 35);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles del Proyecto', 14, 45);

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    const details = [
      `Espacio: ${espacio}`,
      `Dimensiones (cm): ${ancho || '-'} x ${alto || '-'} x ${profundidad || '-'}`,
      `Material Seleccionado: ${material}`,
      `Ciudad de Envío: ${ciudad}`,
      `Instalación y Transporte: ${ciudadesGratis.includes(ciudad) ? 'GRATIS' : 'Sujeto a recargo adicional o viáticos'}`
    ];
    
    details.forEach((text, index) => {
      doc.text(text, 14, 55 + (index * 7));
    });

    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(192, 146, 80); // Gold
    doc.text(`Estimación: $${precioEstimado.min} - $${precioEstimado.max} USD`, 14, 100);
    
    doc.setFontSize(10);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text('* Este documento es una estimación generada algorítmicamente y no constituye un', 14, 110);
    doc.text('compromiso de precio fijo. Un asesor verificará las medidas y diseño final.', 14, 115);

    doc.save('presupuesto-mesias.pdf');
  };

  return (
    <div className="cotizador-container" style={{
      background: '#fff',
      padding: '2rem',
      borderRadius: 'var(--radius-md)',
      boxShadow: 'var(--shadow-card)',
      maxWidth: '600px',
      margin: '0 auto',
      border: '1px solid var(--sand)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '24px', color: 'var(--espresso)', marginBottom: '0.5rem' }}>
          Cotizador Algorítmico
        </h2>
        <p style={{ fontSize: '13px', color: 'var(--walnut)' }}>Estima el costo de tu mueble a medida en tiempo real.</p>
      </div>

      {paso === 1 && (
        <div className="paso-1" style={{ animation: 'lightboxFadeIn 0.4s ease-out forwards' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '14px' }}>1. ¿Qué espacio deseas amoblar?</label>
          <select 
            value={espacio} 
            onChange={(e) => setEspacio(e.target.value as Espacio)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ccc', marginBottom: '1.5rem', fontSize: '14px' }}
          >
            <option value="Sala">Sala de estar</option>
            <option value="Dormitorio">Dormitorio</option>
            <option value="Cocina">Cocina Integral</option>
            <option value="Closet">Closet / Vestidor</option>
            <option value="Baño">Baño</option>
            <option value="Oficina">Oficina / Estudio</option>
            <option value="Otro">Otro mueble especial</option>
          </select>
          <button onClick={() => setPaso(2)} style={{ width: '100%', padding: '0.8rem', background: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
            Siguiente
          </button>
        </div>
      )}

      {paso === 2 && (
        <div className="paso-2" style={{ animation: 'lightboxFadeIn 0.4s ease-out forwards' }}>
          <label style={{ display: 'block', marginBottom: '1rem', fontWeight: 500, fontSize: '14px' }}>2. Medidas aproximadas (en centímetros)</label>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <div>
              <span style={{ fontSize: '11px', color: '#666' }}>Ancho (cm)</span>
              <input type="number" value={ancho} onChange={(e) => setAncho(Number(e.target.value))} placeholder="Ej. 200" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ccc', fontSize: '14px' }} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#666' }}>Alto (cm)</span>
              <input type="number" value={alto} onChange={(e) => setAlto(Number(e.target.value))} placeholder="Ej. 100" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ccc', fontSize: '14px' }} />
            </div>
            <div>
              <span style={{ fontSize: '11px', color: '#666' }}>Prof. (cm)</span>
              <input type="number" value={profundidad} onChange={(e) => setProfundidad(Number(e.target.value))} placeholder="Ej. 50" style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ccc', fontSize: '14px' }} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setPaso(1)} style={{ padding: '0.8rem', background: '#eee', border: 'none', borderRadius: 'var(--radius-sm)', width: '30%', cursor: 'pointer' }}>Atrás</button>
            <button onClick={() => setPaso(3)} style={{ padding: '0.8rem', background: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', width: '70%', cursor: 'pointer' }}>Siguiente</button>
          </div>
        </div>
      )}

      {paso === 3 && (
        <div className="paso-3" style={{ animation: 'lightboxFadeIn 0.4s ease-out forwards' }}>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '14px' }}>3. Selecciona el Material</label>
          <select 
            value={material} 
            onChange={(e) => setMaterial(e.target.value as Material)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ccc', marginBottom: '1.5rem', fontSize: '14px' }}
          >
            <option value="Melamina Premium">Melamina Premium (Pelíkano/Arauco)</option>
            <option value="MDF Pintado">MDF Terminado en Poliuretano</option>
            <option value="Madera Maciza (Seike/Colorada)">Madera Maciza Tratada</option>
          </select>

          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500, fontSize: '14px' }}>Ciudad de Envío e Instalación</label>
          <select 
            value={ciudad} 
            onChange={(e) => setCiudad(e.target.value as Ciudad)}
            style={{ width: '100%', padding: '0.8rem', borderRadius: 'var(--radius-sm)', border: '1px solid #ccc', marginBottom: '0.5rem', fontSize: '14px' }}
          >
            <option value="Ambato">Ambato</option>
            <option value="Riobamba">Riobamba</option>
            <option value="Latacunga">Latacunga</option>
            <option value="Puyo">Puyo</option>
            <option value="Quito">Quito</option>
            <option value="Guayaquil">Guayaquil</option>
            <option value="Otro">Otras provincias</option>
          </select>
          
          <div style={{ marginBottom: '1.5rem', padding: '0.75rem', background: ciudadesGratis.includes(ciudad) ? 'rgba(37, 211, 102, 0.1)' : '#f8f9fa', borderRadius: '4px', fontSize: '12px' }}>
            {ciudadesGratis.includes(ciudad) ? (
              <span style={{ color: 'var(--green-wa-dark)', fontWeight: 600 }}>✅ ¡Envío e instalación totalmente GRATIS en {ciudad}!</span>
            ) : (
              <span style={{ color: '#666' }}>⚠️ El envío a {ciudad} tendrá un costo adicional que se reflejará en la cotización.</span>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => setPaso(2)} style={{ padding: '0.8rem', background: '#eee', border: 'none', borderRadius: 'var(--radius-sm)', width: '30%', cursor: 'pointer' }}>Atrás</button>
            <button onClick={calcularPrecio} style={{ padding: '0.8rem', background: 'var(--gold)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', width: '70%', fontWeight: 'bold', cursor: 'pointer' }}>Calcular Presupuesto</button>
          </div>
        </div>
      )}

      {paso === 4 && precioEstimado && (
        <div className="paso-4" style={{ animation: 'lightboxFadeIn 0.5s ease-out forwards', textAlign: 'center' }}>
          <div style={{ background: '#fcfbf7', border: '1px solid rgba(192, 146, 80, 0.3)', padding: '2rem', borderRadius: 'var(--radius-md)', marginBottom: '1.5rem' }}>
            <p style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--walnut)', letterSpacing: '1px', marginBottom: '0.5rem' }}>Presupuesto Estimado</p>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '32px', color: 'var(--gold)', margin: 0 }}>
              ${precioEstimado.min} - ${precioEstimado.max}
            </h3>
            <p style={{ fontSize: '11px', color: '#888', marginTop: '0.5rem' }}>* Valores referenciales en USD. Sujeto a rectificación de medidas.</p>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
            <button
              onClick={() => {
                const msg = encodeURIComponent(
                  `Hola Muebles Mesías, calculé un presupuesto en su sitio web:\n- Espacio: ${espacio}\n- Dimensiones: ${ancho || '-'}x${alto || '-'}x${profundidad || '-'} cm\n- Material: ${material}\n- Ciudad: ${ciudad}\n- Estimación: $${precioEstimado.min} - $${precioEstimado.max} USD\n¿Podrían brindarme asesoría personalizada?`
                );
                window.open(`https://wa.me/593995795486?text=${msg}`, '_blank');
              }}
              style={{
                padding: '1rem',
                background: '#25D366',
                color: '#0b2212',
                fontWeight: 700,
                border: 'none',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                cursor: 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Enviar Cotización a WhatsApp
            </button>
            <button onClick={generarPDF} style={{ padding: '0.85rem', background: 'var(--espresso)', color: '#fff', border: 'none', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
              Descargar PDF RIMPE
            </button>
            <button onClick={() => setPaso(1)} style={{ padding: '0.85rem', background: 'transparent', color: 'var(--walnut)', border: '1px solid var(--sand)', borderRadius: 'var(--radius-sm)', cursor: 'pointer' }}>
              Volver a cotizar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
