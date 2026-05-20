// app/components/Header.tsx - Navy Blue & Gold Theme
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    
    window.addEventListener('resize', checkMobile);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  if (!mounted) {
    return (
      <header style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        background: 'white',
        zIndex: 1000,
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '12px 24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '45px', height: '45px', background: '#1e3a8a', borderRadius: '12px' }}></div>
            <span style={{ fontSize: '22px', fontWeight: 'bold' }}>
              <span style={{ color: '#fbbf24' }}>Khorshid</span>
              <span style={{ color: '#1e3a8a' }}>Community</span>
            </span>
          </div>
        </div>
      </header>
    );
  }

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'white',
      backdropFilter: scrolled ? 'blur(10px)' : 'none',
      boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.1)' : '0 1px 3px rgba(0,0,0,0.05)',
      zIndex: 1000,
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '12px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        {/* Logo */}
        <Link href="/" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          textDecoration: 'none',
        }}>
          <img 
            src="/images/logo.jpg" 
            alt="KhorshidCommunity Logo" 
            style={{
              width: '45px',
              height: '45px',
              borderRadius: '12px',
              objectFit: 'cover',
            }}
          />
          <div>
            <span style={{ 
              fontSize: '22px', 
              fontWeight: 'bold',
              color: '#fbbf24',
            }}>
              Khorshid
            </span>
            <span style={{ 
              fontSize: '22px', 
              fontWeight: 'bold',
              color: '#1e3a8a',
            }}>
              Community
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            <div style={{
              display: 'flex',
              gap: '32px',
              alignItems: 'center',
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
            }}>
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    color: '#374151',
                    textDecoration: 'none',
                    fontSize: '15px',
                    fontWeight: '500',
                    transition: 'color 0.2s ease',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                  onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                >
                  {link.label}
                </Link>
              ))}
            </div>

            <Link
              href="/contact"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: '#1e3a8a',
                padding: '10px 24px',
                borderRadius: '50px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                transition: 'transform 0.2s ease',
                display: 'inline-block',
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
            >
              ✨ Join Us
            </Link>
          </>
        )}

        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              padding: '8px',
              color: '#374151',
              width: '44px',
              height: '44px',
              borderRadius: '8px',
              transition: 'background 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
          >
            {isOpen ? '✕' : '☰'}
          </button>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && isOpen && (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          padding: '20px 24px 24px',
          background: 'white',
          borderTop: '1px solid #e5e7eb',
          animation: 'slideDown 0.3s ease',
        }}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              style={{
                padding: '14px 16px',
                color: '#374151',
                textDecoration: 'none',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '12px',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#fef3c7';
                e.currentTarget.style.color = '#fbbf24';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#374151';
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/contact"
            onClick={() => setIsOpen(false)}
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: '#1e3a8a',
              padding: '14px 24px',
              borderRadius: '50px',
              textDecoration: 'none',
              textAlign: 'center',
              fontSize: '16px',
              fontWeight: '600',
              marginTop: '8px',
              display: 'block',
            }}
          >
            ✨ Join Our Community
          </Link>
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `
      }} />
    </header>
  );
}