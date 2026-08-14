'use client';

import { useState } from 'react';

interface Dimensiones {
  alto: number;
  ancho: number;
  profundidad: number;
}

interface QuoteFormData {
  nombre: string;
  email: string;
  descripcion: string;
  dimensiones: Dimensiones;
  material: string;
}

export default function QuoteForm() {
  const [formData, setFormData] = useState<QuoteFormData>({
    nombre: '',
    email: '',
    descripcion: '',
    dimensiones: { alto: 0, ancho: 0, profundidad: 0 },
    material: 'pino',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (['alto', 'ancho', 'profundidad'].includes(name)) {
      setFormData({
        ...formData,
        dimensiones: {
          ...formData.dimensiones,
          [name]: parseFloat(value) || 0,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    
    try {
      const res = await fetch('/api/v1/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      
      const data = await res.json();
      
      if (data.success) {
        setStatus('success');
        setMessage(`¡Cotización generada! Precio estimado: $${data.precioEstimado}. Hemos enviado el PDF a tu correo.`);
        setFormData({
          nombre: '',
          email: '',
          descripcion: '',
          dimensiones: { alto: 0, ancho: 0, profundidad: 0 },
          material: 'pino',
        });
      } else {
        setStatus('error');
        setMessage(data.message || 'Error al generar la cotización.');
      }
    } catch (err) {
      setStatus('error');
      setMessage('Error de conexión. Inténtalo más tarde.');
    }
  };

  return (
    <div className="contact-card" id="cotizacion">
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--wood-dark)' }}>Cotización a Medida</h2>
      <p style={{ marginBottom: '2rem', color: 'var(--text-light)' }}>
        Ingresa las medidas y material deseado para recibir una cotización estimada al instante y un PDF en tu correo.
      </p>

      {status === 'success' && <div style={{ padding: '1rem', background: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}
      {status === 'error' && <div style={{ padding: '1rem', background: '#f8d7da', color: '#721c24', borderRadius: '4px', marginBottom: '1rem' }}>{message}</div>}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Nombre</label>
            <input required type="text" name="nombre" value={formData.nombre} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Email</label>
            <input required type="email" name="email" value={formData.email} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Descripción del mueble</label>
          <textarea required name="descripcion" rows={3} value={formData.descripcion} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} placeholder="Ej: Mesa de centro estilo industrial con bordes rústicos..."></textarea>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Alto (cm)</label>
            <input required type="number" name="alto" value={formData.dimensiones.alto || ''} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Ancho (cm)</label>
            <input required type="number" name="ancho" value={formData.dimensiones.ancho || ''} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Prof. (cm)</label>
            <input required type="number" name="profundidad" value={formData.dimensiones.profundidad || ''} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Material</label>
          <select name="material" value={formData.material} onChange={handleChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}>
            <option value="pino">Pino (Económico)</option>
            <option value="roble">Roble (Estándar)</option>
            <option value="nogal">Nogal (Premium)</option>
            <option value="metal">Metal</option>
            <option value="mixto">Mixto (Madera + Metal)</option>
          </select>
        </div>

        <button type="submit" className="contact-btn" disabled={status === 'loading'} style={{ opacity: status === 'loading' ? 0.7 : 1 }}>
          {status === 'loading' ? 'Generando cotización...' : 'Cotizar ahora'}
        </button>
      </form>
    </div>
  );
}
