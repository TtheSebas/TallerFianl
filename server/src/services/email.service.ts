/**
 * @fileoverview Servicio de email para cotizaciones.
 * Envía correos con PDF adjunto usando nodemailer.
 */

import nodemailer, { Transporter } from 'nodemailer';

/* ------------------------------------------------------------------ */
/*  Transporter singleton                                             */
/* ------------------------------------------------------------------ */

let transporter: Transporter | null = null;

function getTransporter(): Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.mailtrap.io',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
      },
    });
  }
  return transporter;
}

/* ------------------------------------------------------------------ */
/*  Public API                                                        */
/* ------------------------------------------------------------------ */

/**
 * Enviar un correo con un PDF de cotización adjunto.
 *
 * @param to        - Email del destinatario.
 * @param subject   - Asunto del correo.
 * @param pdfBuffer - Buffer del PDF generado.
 * @param filename  - Nombre del archivo PDF adjunto.
 */
export async function sendQuoteEmail(
  to: string,
  subject: string,
  pdfBuffer: Buffer,
  filename: string,
): Promise<void> {
  const from = process.env.EMAIL_FROM || 'ventas@taller2.com';

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto">
      <div style="background:#3E2723;padding:20px;text-align:center">
        <h1 style="color:#BF9B30;margin:0">Taller 2.0</h1>
        <p style="color:#FAF8F5;margin:4px 0 0">Muebles Artesanales</p>
      </div>
      <div style="padding:24px;background:#FAF8F5">
        <p>Hola,</p>
        <p>Adjuntamos tu cotización de mueble a medida.</p>
        <p>Revisa el PDF adjunto para ver los detalles completos del presupuesto, 
        incluyendo dimensiones, material y precio estimado.</p>
        <p>Este presupuesto tiene una validez de <strong>15 días</strong>.</p>
        <p>Si tienes alguna pregunta, no dudes en contactarnos.</p>
      </div>
      <div style="background:#3E2723;padding:12px;text-align:center">
        <p style="color:#7f8c8d;font-size:11px;margin:0">
          Este correo fue generado automáticamente — no responder.
        </p>
      </div>
    </div>
  `;

  await getTransporter().sendMail({
    from,
    to,
    subject,
    html,
    attachments: [
      {
        filename,
        content: pdfBuffer,
        contentType: 'application/pdf',
      },
    ],
  });
}

/**
 * Enviar un email genérico (sin adjuntos).
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  const from = process.env.EMAIL_FROM || 'ventas@taller2.com';
  await getTransporter().sendMail({ from, to, subject, html });
}
