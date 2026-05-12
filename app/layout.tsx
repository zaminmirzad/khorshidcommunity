// app/layout.tsx - Professional Design with Centered Menu
'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
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

  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          background: scrolled ? 'rgba(255, 255, 255, 0.98)' : 'white',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
          zIndex: 1000,
          transition: 'all 0.3s ease',
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '16px 24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            {/* Logo - Left */}
            <Link href="/" style={{
              fontSize: '24px',
              fontWeight: 'bold',
              textDecoration: 'none',
              background: 'linear-gradient(135deg, #b45309 0%, #ea580c 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}>
              KhorshidCommunity
            </Link>

            {/* Desktop Navigation - Centered */}
            {!isMobile && (
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
                      padding: '8px 4px',
                      position: 'relative',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#d97706'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#374151'}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}

            {/* Join Us Button - Right */}
            {!isMobile && (
              <Link
                href="/contact"
                style={{
                  background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
                  color: 'white',
                  padding: '10px 24px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 2px 8px rgba(217, 119, 6, 0.2)',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(217, 119, 6, 0.2)';
                }}
              >
                ✨ Join Us
              </Link>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#374151',
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
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
              borderTop: '1px solid #f3f4f6',
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
                    e.currentTarget.style.color = '#d97706';
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
                  background: 'linear-gradient(135deg, #d97706 0%, #ea580c 100%)',
                  color: 'white',
                  padding: '14px 24px',
                  borderRadius: '50px',
                  textDecoration: 'none',
                  textAlign: 'center',
                  fontSize: '16px',
                  fontWeight: '600',
                  marginTop: '8px',
                  transition: 'all 0.3s ease',
                }}
              >
                ✨ Join Our Community
              </Link>
            </div>
          )}
        </div>

        {/* Content padding */}
        <div style={{ paddingTop: '80px' }}>
          {children}
        </div>

        {/* Modern Footer */}
        <footer style={{
          background: 'linear-gradient(135deg, #111827 0%, #1f2937 100%)',
          color: '#9ca3af',
          padding: '60px 24px 32px',
          marginTop: '80px',
        }}>
          <div style={{
            maxWidth: '1280px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '40px',
            textAlign: 'left',
          }}>
            <div>
              <h3 style={{ color: 'white', fontSize: '20px', marginBottom: '16px' }}>KhorshidCommunity</h3>
              <p style={{ fontSize: '14px', lineHeight: '1.6' }}>
                Uniting hearts, preserving heritage, and building a vibrant future together since 1998.
              </p>
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>Quick Links</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {navLinks.map((link) => (
                  <li key={link.href} style={{ marginBottom: '8px' }}>
                    <Link href={link.href} style={{ color: '#9ca3af', textDecoration: 'none', fontSize: '14px' }}>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>Contact</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '1.8' }}>
                <li>📍 123 Unity Avenue, San Diego CA</li>
                <li>📞 +1 (555) 678-2345</li>
                <li>✉️ hello@khorshidcommunity.org</li>
              </ul>
            </div>
            <div>
              <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '16px' }}>Follow Us</h4>
              <div style={{ display: 'flex', gap: '16px' }}>
                <span style={{ fontSize: '24px', cursor: 'pointer' }}>📷</span>
                <span style={{ fontSize: '24px', cursor: 'pointer' }}>📘</span>
                <span style={{ fontSize: '24px', cursor: 'pointer' }}>▶️</span>
                <span style={{ fontSize: '24px', cursor: 'pointer' }}>💼</span>
              </div>
            </div>
          </div>
          <div style={{
            maxWidth: '1280px',
            margin: '40px auto 0',
            paddingTop: '32px',
            borderTop: '1px solid #374151',
            textAlign: 'center',
            fontSize: '14px',
          }}>
            <p>© 2025 KhorshidCommunity. All rights reserved. | Built with ❤️ for the community</p>
          </div>
        </footer>

        {/* Animation keyframes */}
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
      </body>
    </html>
  );
}