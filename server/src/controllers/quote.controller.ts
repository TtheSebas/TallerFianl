/**
 * @fileoverview Controlador de cotizaciones — maneja peticiones HTTP
 * para el módulo de muebles a medida.
 */

import { Request, Response } from 'express';
import { generateQuotePDF } from '../utils/pdf.generator';
import { sendQuoteEmail } from '../services/email.service';
import { CotizacionRepository } from '../repositories/cotizacion.repository';
import { QuoteRequest, Cotizacion, Dimensiones, MaterialCotizacion, ApiResponse, PaginatedResult } from '../types';
import { paginate } from '../utils/helpers';

const repo = new CotizacionRepository();

/**
 * POST /quotes
 * Crear una nueva cotización de mueble a medida.
 */
export async function createQuote(req: Request, res: Response): Promise<void> {
  try {
    const body: QuoteRequest = req.body;

    // Validación básica (en producción usar librería como Zod)
    if (!body.email || !body.dimensiones || !body.material) {
      res.status(400).json({
        success: false,
        message: 'Faltan campos requeridos: email, dimensiones, material',
      });
      return;
    }

    // Lógica de negocio: estimar precio según dimensiones y material
    const precioEstimado = calcularPrecioEstimado(
      body.dimensiones,
      body.material,
      body.acabados || [],
    );

    // Generar PDF con la cotización
    const pdfBuffer = await generateQuotePDF({
      cliente: body.nombre || 'Cliente Anónimo',
      email: body.email,
      descripcion: body.descripcion || 'Mueble a medida',
      dimensiones: body.dimensiones,
      material: body.material,
      acabados: body.acabados || [],
      precioEstimado,
      fecha: new Date().toLocaleDateString('es-EC'),
    });

    // Guardar cotización en BD
    const quoteRecord = await repo.create({
      email_solicitante: body.email,
      datos_proyecto: body as any,
      precio_estimado: precioEstimado,
    });

    // Enviar correo con el PDF adjunto
    await sendQuoteEmail(
      body.email,
      'Cotización de mueble a medida — Taller 2.0',
      pdfBuffer,
      `cotizacion_${quoteRecord.id}.pdf`,
    ).catch((err) =>
      console.error('[QuoteController] Error al enviar email:', err),
    );

    res.status(201).json({
      success: true,
      message: 'Cotización generada y enviada exitosamente',
      data: {
        cotizacionId: quoteRecord.id,
        precioEstimado,
      },
    });
  } catch (error) {
    console.error('Error generando cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno al procesar la cotización',
    });
  }
}

/**
 * GET /quotes/:id
 * Obtener una cotización por su ID.
 */
export async function getQuoteById(req: Request, res: Response): Promise<void> {
  try {
    const quote = await repo.findById(req.params.id as string);
    if (!quote) {
      res.status(404).json({ success: false, message: 'Cotización no encontrada.' });
      return;
    }
    const response: ApiResponse<Cotizacion> = { success: true, data: quote };
    res.json(response);
  } catch (err) {
    const error = err as Error;
    console.error('[QuoteController] getQuoteById error:', error.message);
    res.status(500).json({ success: false, message: error.message });
  }
}

/**
 * GET /quotes  (auth required)
 * Listar cotizaciones con paginación.
 */
export async function listQuotes(req: Request, res: Response): Promise<void> {
  try {
    const pag = paginate(req.query.page as string, req.query.limit as string);
    const result = await repo.findAll(pag);
    const response: ApiResponse<PaginatedResult<Cotizacion>> = { success: true, data: result };
    res.json(response);
  } catch (err) {
    console.error('[QuoteController] listQuotes error:', err);
    res.status(500).json({ success: false, message: 'Error al listar cotizaciones.' });
  }
}

/* ------------------------------------------------------------------ */
/*  Cálculo de precio                                                 */
/* ------------------------------------------------------------------ */

/**
 * Calcula el precio estimado según dimensiones, material y acabados.
 * En producción usar un modelo de costos más complejo.
 */
function calcularPrecioEstimado(
  dims: Dimensiones,
  material: string,
  acabados: string[],
): number {
  const volumen = dims.alto * dims.ancho * dims.profundidad;
  const tarifasMaterial: Record<string, number> = {
    pino: 0.08,
    roble: 0.15,
    nogal: 0.2,
  };
  const base = volumen * (tarifasMaterial[material] || 0.1);
  const extraAcabados = acabados.length * 50;
  return Math.round((base + extraAcabados) * 100) / 100;
}
