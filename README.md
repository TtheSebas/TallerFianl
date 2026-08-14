<p align="center">
  <h1 align="center">Taller 2.0 🪑</h1>
  <p align="center">
    Sistema integral para Línea de Muebles Mesías
    <br />
    <strong>Catálogo Premium · Cotizaciones Algorítmicas en PDF · Facturación</strong>
  </p>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" alt="Next.js" />
  <img src="https://img.shields.io/badge/Express-4-000000?style=for-the-badge&logo=express" alt="Express" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</p>

---

## 📋 Descripción

**Taller 2.0** es una aplicación web de vanguardia diseñada para **Línea de Muebles Mesías**. Destaca por una interfaz orientada al "Minimalismo Premium", resaltando la calidad y artesanía de los muebles. Permite a los clientes explorar colecciones de alta calidad mediante galerías interactivas, estimar costos en tiempo real con un algoritmo inteligente, y descargar proformas en formato PDF instantáneamente.

A nivel administrativo, cuenta con un robusto backend en Node.js/Express para la gestión de productos, emisión de facturas y control logístico.

## ✨ Características Frontend (Cliente)

- 🎨 **Minimalismo Premium** — Interfaz limpia con tipografías elegantes (Playfair Display, Inter), animaciones fluidas, y diseños adaptativos usando `clamp()` para una escalabilidad de resoluciones perfecta.
- 🪑 **Galería Interactiva (Lightbox)** — Componente de visualización inmersiva de colecciones de muebles, con atajos de teclado, animaciones de transición CSS nativas e indexación dinámica.
- 🔢 **Cotizador Algorítmico en Tiempo Real** — Sistema avanzado interactivo de 4 pasos para calcular presupuestos según: volumen cúbico, tipo de material (Melamina Premium, MDF, Seike), tipo de mueble y logística de la ciudad.
- 📄 **Proformas en PDF (jsPDF)** — Generación y descarga directa desde el navegador de estimaciones formales sin necesidad de solicitudes previas al backend.
- 🚚 **Módulo Logístico Integrado** — Envíos e instalación gratuita en ciudades de cobertura central (Ambato, Riobamba, Latacunga, Puyo) y cálculo automático de recargos para el resto del país.
- 🔄 **Visor Interactivo Antes y Después** — Slider comparativo para demostrar la calidad del trabajo de instalación de mobiliario.

## ⚙️ Características Backend (Servidor)

- 🔐 **Autenticación Segura** — Sistema con JWT para control de accesos de clientes y panel de administración.
- 📦 **API REST Estructurada** — Puntos de enlace robustos para gestionar usuarios, productos, cotizaciones e inventarios (construido sobre Express y Prisma ORM).
- 🧾 **Facturación** — Lógica de emisión y registro de facturas para los clientes que concretan sus compras.

## 🏗️ Arquitectura del Proyecto

```
taller-2.0/
├── client/                          # Frontend – Next.js 14
│   ├── public/                      # Archivos estáticos
│   │   └── img/                     # Imágenes del sitio y colecciones
│   ├── app/                         # App Router de Next.js
│   │   ├── layout.tsx               # Layout principal
│   │   ├── page.tsx                 # Landing Page y Catálogo
│   │   └── globals.css              # Variables de diseño Premium, animaciones
│   ├── components/                  # Componentes interactivos
│   │   ├── Navbar.tsx               # Menú de navegación
│   │   ├── GalleryModal.tsx         # Lightbox avanzado
│   │   ├── CotizadorAlgoritmico.tsx # Cotizador con jsPDF
│   │   ├── BeforeAfter.tsx          # Slider Antes/Después
│   │   └── Footer.tsx               # Pie de página y contacto
│   ├── lib/                         
│   │   └── GalleryData.ts           # Datos de galerías de muebles
│   ├── Dockerfile                   # Configuración para contenedor cliente
│   ├── next.config.mjs
│   └── package.json
│
├── server/                          # Backend – Express + TypeScript
│   ├── src/
│   │   ├── config/                  # Configuración de base de datos y entorno
│   │   ├── controllers/             # Controladores de las rutas
│   │   ├── routes/                  # Definición de endpoints API
│   │   ├── services/                # Lógica de negocio (Products, Quotes...)
│   │   ├── utils/                   # Utilidades de servidor
│   │   └── app.ts                   # Entry point de la aplicación Express
│   ├── prisma/
│   │   └── schema.prisma            # Esquema de la Base de Datos PostgreSQL
│   ├── Dockerfile                   # Configuración para contenedor servidor
│   └── package.json
│
├── docker-compose.yml               # Orquestación y levantamiento simultáneo
├── .env                             # Variables de entorno locales
└── README.md                        # Documentación principal
```

## 🚀 Inicio Rápido

### Con Docker (Método Principal)

```bash
# 1. Clonar el repositorio
git clone https://github.com/TtheSebas/taller-2.0.git
cd taller-2.0

# 2. Levantar todos los servicios con Compose (esto construirá las imágenes)
docker-compose up --build -d

# 3. ¡Listo! La aplicación estará disponible en:
#    🌐 Cliente UI:   http://localhost:3000
#    🔌 Servidor API: http://localhost:4000/api
```
*(Nota: Si modificas los archivos `.tsx` del lado del cliente, asegúrate de utilizar el entorno de desarrollo local o volver a hacer un `--build` del contenedor `client`, ya que el Dockerfile utiliza una versión optimizada de producción).*

### Desarrollo Local (con Hot-Reload)

```bash
# 1. Frontend (Next.js)
cd client
npm install
npm run dev
# Disponible en http://localhost:3000

# 2. Backend (Express) - (En una segunda terminal)
cd server
npm install
npx prisma generate
npm run dev
# Disponible en http://localhost:4000
```

## 🛠️ Scripts Principales

### Cliente (`/client`)
- `npm run dev`: Ejecuta el entorno de desarrollo con actualización en tiempo real (hot reload).
- `npm run build`: Construye la versión optimizada para producción (`.next`).
- `npm start`: Inicia el servidor de producción usando los archivos compilados.

### Servidor (`/server`)
- `npm run dev`: Ejecuta el servidor Express con ts-node-dev.
- `npm run build`: Transpila TypeScript a JavaScript estático.

## 🤝 Contribuir
Sigue el estándar [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` — Nueva funcionalidad (ej. `feat: Cotizador algorítmico integrado`)
- `fix:` — Corrección de bugs (ej. `fix: Error de animaciones CSS resuelto`)
- `style:` — Cambios visuales / estéticos
- `refactor:` — Reorganización de código

---
<p align="center">
  Hecho con ❤️ para artesanos y diseñadores
</p>
