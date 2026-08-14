'use client';
import Image from 'next/image';
export default function Testimonials() {
  return (
    <section className="testimonials" id="testimonios">
      <div className="collections-header">
        <p className="section-label">Lo que dicen nuestros clientes</p>
        <h2 className="section-title">Opiniones reales</h2>
      </div>
      <div
        className="testimonials-grid"
        style={{ gridTemplateColumns: '1fr', maxWidth: '900px' }}
      >
        {/* Card 1 */}
        <div className="testimonial-card-v2 reveal">
          <Image src="/img/salaysofas/111.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Sofá instalado"
            className="testimonial-photo"
            loading="lazy"
            width={400}
            height={300}
          />
          <div className="testimonial-content">
            <div className="stars">★★★★★</div>
            <p>
              &ldquo;El sofá que compré superó mis expectativas. La calidad de la
              madera y el tapizado es increíble. Definitivamente volvería a
              comprar!&rdquo;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">MR</div>
              <div>
                <span className="author-name">Maria R.</span>
                <span className="author-city">Ambato</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2 */}
        <div className="testimonial-card-v2 reveal">
          <Image src="/img/comedor/11.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Comedor instalado"
            className="testimonial-photo"
            loading="lazy"
            width={400}
            height={300}
          />
          <div className="testimonial-content">
            <div className="stars">★★★★★</div>
            <p>
              &ldquo;Muy buena atención desde el primer mensaje por WhatsApp. El
              comedor llegó a tiempo y perfectamente instalado. 100%
              recomendado.&rdquo;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">JC</div>
              <div>
                <span className="author-name">Juan C.</span>
                <span className="author-city">Quito</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3 */}
        <div className="testimonial-card-v2 reveal">
          <Image src="/img/dormitorio/1.webp" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            alt="Dormitorio amueblado"
            className="testimonial-photo"
            loading="lazy"
            width={400}
            height={300}
          />
          <div className="testimonial-content">
            <div className="stars">★★★★★</div>
            <p>
              &ldquo;Amueblé todo mi departamento con Mesías. El precio es justo
              y los muebles duran. Ya van 3 años y como nuevos.&rdquo;
            </p>
            <div className="testimonial-author">
              <div className="author-avatar">LP</div>
              <div>
                <span className="author-name">Lucia P.</span>
                <span className="author-city">Guayaquil</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
