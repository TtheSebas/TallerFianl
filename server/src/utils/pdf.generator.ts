/**
 * @fileoverview Generador de PDF para cotizaciones de muebles a medida.
 * Usa PDFKit para crear documentos profesionales.
 */

import PDFDocument from 'pdfkit';
import { QuotePDFData } from '../types';

/* ------------------------------------------------------------------ */
/*  Constants                                                         */
/* ------------------------------------------------------------------ */

const BRAND_COLOR = '#3E2723';
const ACCENT_COLOR = '#BF9B30';
const TEXT_COLOR = '#2C2C2C';
const LIGHT_BG = '#FAF8F5';
const PAGE_MARGIN = 50;

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/**
 * Genera un PDF profesional de cotización de mueble a medida.
 *
 * @param data - Datos de la cotización.
 * @returns Promise con el Buffer del PDF.
 */
export function generateQuotePDF(data: QuotePDFData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: 'LETTER', margin: PAGE_MARGIN });
    const chunks: Buffer[] = [];
    doc.on('data', (chunk: Buffer) => chunks.push(chunk));
    doc.on('end', () => resolve(Buffer.concat(chunks)));
    doc.on('error', reject);

    // ---- Encabezado con marca ----
    doc.rect(0, 0, doc.page.width, 90).fill(BRAND_COLOR);
    doc
      .fontSize(24)
      .fillColor('#ffffff')
      .text('TALLER 2.0', PAGE_MARGIN, 20, { align: 'left' });
    doc
      .fontSize(10)
      .fillColor(ACCENT_COLOR)
      .text('Muebles Artesanales — Cotización a Medida', PAGE_MARGIN, 50, { align: 'left' });

    // Fecha (derecha)
    doc
      .fontSize(10)
      .fillColor('#ffffff')
      .text(`Fecha: ${data.fecha}`, 0, 30, {
        align: 'right',
        width: doc.page.width - PAGE_MARGIN,
      });

    doc.y = 110;

    // ---- Datos del cliente ----
    doc
      .fontSize(13)
      .fillColor(BRAND_COLOR)
      .text('Datos del Cliente', PAGE_MARGIN, doc.y, { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor(TEXT_COLOR);
    doc.text(`Cliente: ${data.cliente}`);
    doc.text(`Email: ${data.email}`);
    doc.moveDown(1);

    // ---- Detalle del proyecto ----
    doc
      .fontSize(13)
      .fillColor(BRAND_COLOR)
      .text('Detalle del Proyecto', PAGE_MARGIN, doc.y, { underline: true });
    doc.moveDown(0.5);
    doc.fontSize(11).fillColor(TEXT_COLOR);
    doc.text(`Descripción: ${data.descripcion}`);
    doc.text(
      `Dimensiones (alto × ancho × prof): ${data.dimensiones.alto}cm × ${data.dimensiones.ancho}cm × ${data.dimensiones.profundidad}cm`,
    );
    doc.text(`Material: ${data.material}`);
    doc.text(
      `Acabados: ${data.acabados.length ? data.acabados.join(', ') : 'Ninguno'}`,
    );
    doc.moveDown(1.5);

    // ---- Precio estimado ----
    doc
      .fontSize(13)
      .fillColor(BRAND_COLOR)
      .text('Precio Estimado', PAGE_MARGIN, doc.y, { underline: true });
    doc.moveDown(0.5);
    doc
      .fontSize(22)
      .fillColor(ACCENT_COLOR)
      .text(`$${data.precioEstimado.toFixed(2)}`);
    doc.moveDown(2);

    // ---- Línea separadora ----
    doc
      .moveTo(PAGE_MARGIN, doc.y)
      .lineTo(doc.page.width - PAGE_MARGIN, doc.y)
      .strokeColor(ACCENT_COLOR)
      .lineWidth(1)
      .stroke();
    doc.moveDown(1);

    // ---- Nota legal ----
    doc
      .fontSize(9)
      .fillColor('#7f8c8d')
      .text(
        'Este presupuesto tiene validez de 15 días. ' +
          'Sujeto a confirmación final de medidas y disponibilidad de materiales. ' +
          'Se requiere un anticipo del 50% para iniciar la producción.',
        { lineGap: 3 },
      );

    doc.end();
  });
}
