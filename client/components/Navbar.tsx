'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const scrollToContact = () => {
    setIsMenuOpen(false);
    document.getElementById('contacto')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav className={isScrolled ? 'nav--scrolled' : ''}>
        <a href="#" className="logo" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          Línea de Muebles <span>Mesías</span>
          <span style={{ fontSize: '0.75rem', background: 'var(--wood-medium)', color: '#fff', padding: '0.2rem 0.5rem', borderRadius: '4px', letterSpacing: 'normal', textTransform: 'none', fontFamily: 'sans-serif' }}>
            Taller 2.0
          </span>
        </a>
        <div className="nav-links">
          <Link href="#colecciones">Colecciones</Link>
          <Link href="/catalogo" style={{ color: 'var(--gold)', fontWeight: 600 }}>Catálogo Editorial</Link>
          <Link href="#proceso">Proceso</Link>
          <Link href="#nosotros">Nosotros</Link>
          <Link href="#faq">FAQ</Link>
          <Link href="#contacto">Contacto</Link>
        </div>
        <button className="nav-cta" onClick={scrollToContact}>
          Cotizar ahora
        </button>
        <button
          className={`hamburger ${isMenuOpen ? 'open' : ''}`}
          id="hamburger"
          aria-label="Abrir menú"
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
      </nav>

      <div className={`mobile-menu ${isMenuOpen ? 'open mobile-menu--open' : ''}`} id="mobileMenu">
        <Link href="/catalogo" onClick={toggleMenu} style={{ color: 'var(--gold)', fontWeight: 600 }}>✦ Catálogo Editorial (12 Págs)</Link>
        <Link href="#colecciones" onClick={toggleMenu}>Colecciones</Link>
        <Link href="#proceso" onClick={toggleMenu}>Proceso</Link>
        <Link href="#nosotros" onClick={toggleMenu}>Nosotros</Link>
        <Link href="#faq" onClick={toggleMenu}>FAQ</Link>
        <Link href="#contacto" onClick={toggleMenu}>Contacto</Link>
      </div>
    </>
  );
}
