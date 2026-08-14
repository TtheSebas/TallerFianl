/**
 * @fileoverview Controlador de autenticación — registro, login y perfil de clientes.
 */

import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ClienteRepository } from '../repositories/user.repository';
import { ClienteDTO, AuthPayload, AuthResponse, ApiResponse, Cliente } from '../types';

const clienteRepo = new ClienteRepository();
const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '8h';
const SALT_ROUNDS = 12;

/**
 * POST /auth/register
 * Registrar un nuevo cliente.
 */
export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, nombre_completo, password, telefono, direccion_envio } = req.body as ClienteDTO;

    if (!email || !password || !nombre_completo) {
      res.status(400).json({
        success: false,
        message: 'Campos obligatorios: email, password, nombre_completo.',
      });
      return;
    }

    const existing = await clienteRepo.findByEmail(email);
    if (existing) {
      res.status(409).json({ success: false, message: 'El correo ya está registrado.' });
      return;
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    const cliente = await clienteRepo.create({
      email,
      nombre_completo,
      telefono,
      direccion_envio,
      password_hash,
    });

    const payload: AuthPayload = { userId: cliente.id, email: cliente.email, role: 'cliente' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });

    const { password_hash: _, ...safeCliente } = cliente;

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: { token, user: safeCliente as any },
      message: 'Cliente registrado exitosamente.',
    };
    res.status(201).json(response);
  } catch (err) {
    console.error('[AuthController] register error:', err);
    res.status(500).json({ success: false, message: 'Error al registrar cliente.' });
  }
}

/**
 * POST /auth/login
 * Autenticar con email + contraseña y devolver JWT.
 */
export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email: string; password: string };

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email y contraseña son obligatorios.',
      });
      return;
    }

    const cliente = await clienteRepo.findByEmail(email);
    if (!cliente) {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
      return;
    }

    const match = await bcrypt.compare(password, cliente.password_hash);
    if (!match) {
      res.status(401).json({ success: false, message: 'Credenciales incorrectas.' });
      return;
    }

    const payload: AuthPayload = { userId: cliente.id, email: cliente.email, role: 'cliente' };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'] });

    const { password_hash: _, ...safeCliente } = cliente;

    const response: ApiResponse<AuthResponse> = {
      success: true,
      data: { token, user: safeCliente as any },
    };
    res.json(response);
  } catch (err) {
    console.error('[AuthController] login error:', err);
    res.status(500).json({ success: false, message: 'Error al iniciar sesión.' });
  }
}

/**
 * GET /auth/me  (auth required)
 * Obtener el perfil del cliente autenticado.
 */
export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'No autenticado.' });
      return;
    }

    const cliente = await clienteRepo.findById(req.user.userId);
    if (!cliente) {
      res.status(404).json({ success: false, message: 'Cliente no encontrado.' });
      return;
    }

    const { password_hash: _, ...safeCliente } = cliente;
    res.json({ success: true, data: safeCliente });
  } catch (err) {
    console.error('[AuthController] getMe error:', err);
    res.status(500).json({ success: false, message: 'Error al obtener perfil.' });
  }
}
