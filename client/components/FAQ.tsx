'use client';

export default function FAQ() {
  return (
    <section className="faq-section" id="faq">
      <div className="collections-header">
        <p className="section-label">Preguntas frecuentes</p>
        <h2 className="section-title">Resolvemos tus dudas</h2>
      </div>
      <div className="faq-grid">
        <details className="faq-item reveal">
          <summary>¿Cuánto tiempo tarda la fabricación de un mueble?</summary>
          <div className="faq-answer">
            El tiempo de fabricación depende del tipo y complejidad del mueble. En
            promedio, un mueble estándar tarda entre{' '}
            <strong>15 y 25 días hábiles</strong>. Piezas más complejas como
            cocinas integrales o closets a medida pueden tomar entre 30 y 45 días.
            Te mantenemos informado en todo momento por WhatsApp.
          </div>
        </details>

        <details className="faq-item reveal reveal-delay-1">
          <summary>¿Qué métodos de pago aceptan?</summary>
          <div className="faq-answer">
            Aceptamos <strong>transferencia bancaria, depósito, efectivo y tarjeta
            de crédito/débito</strong>. Manejamos un esquema de{' '}
            <strong>50% al iniciar</strong> el proyecto y{' '}
            <strong>50% al entregar</strong> el mueble terminado.
          </div>
        </details>

        <details className="faq-item reveal reveal-delay-2">
          <summary>¿Los muebles tienen garantía?</summary>
          <div className="faq-answer">
            Sí, todos nuestros muebles cuentan con{' '}
            <strong>garantía de 1 año contra defectos de fabricación</strong>.
            Nos aseguramos de utilizar materiales de alta calidad para que tu
            inversión dure por muchos años.
          </div>
        </details>

        <details className="faq-item reveal reveal-delay-3">
          <summary>¿Hacen envíos a todo Ecuador?</summary>
          <div className="faq-answer">
            Sí, realizamos <strong>envíos a nivel nacional</strong>. Las entregas
            en <strong>Ambato, Riobamba, Latacunga y Puyo</strong> son{' '}
            <strong>gratis</strong>. Para ciudades como{' '}
            <strong>Quito, Guayaquil y Cuenca</strong> se aplica un costo
            adicional de envío que te indicamos antes de confirmar tu pedido.
          </div>
        </details>

        <details className="faq-item reveal">
          <summary>¿Puedo personalizar el color y medidas?</summary>
          <div className="faq-answer">
            <strong>Absolutamente</strong>. Fabricamos todo a medida. Puedes elegir
            el color, el tipo de madera, las dimensiones y los acabados que mejor
            se adapten a tu espacio. Envíanos tus ideas por WhatsApp y te
            asesoramos sin compromiso.
          </div>
        </details>
      </div>
    </section>
  );
}
