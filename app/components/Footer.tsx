// app/components/Footer.tsx - Navy Blue & Gold Theme
'use client';

import Link from 'next/link';

export default function Footer() {
  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/events', label: 'Events' },
    { href: '/about', label: 'About' },
    { href: '/gallery', label: 'Gallery' },
    { href: '/contact', label: 'Contact' },
  ];

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#9ca3af',
      padding: '60px 24px 32px',
      marginTop: '80px',
    }}>
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
      }}>
        {/* Footer Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Logo and About Section */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <img 
                src="/images/logo.jpg" 
                alt="KhorshidCommunity Logo" 
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '12px',
                  objectFit: 'cover',
                }}
              />
              <div>
                <span style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: '#fbbf24',
                }}>
                  Khorshid
                </span>
                <span style={{ 
                  fontSize: '20px', 
                  fontWeight: 'bold',
                  color: 'white',
                }}>
                  Community
                </span>
              </div>
            </div>
            <p style={{ fontSize: '14px', lineHeight: '1.6', color: '#9ca3af' }}>
              Uniting hearts, preserving heritage, and building a vibrant future together since 1998.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '20px', fontWeight: '600' }}>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {navLinks.map((link) => (
                <li key={link.href} style={{ marginBottom: '12px' }}>
                  <Link 
                    href={link.href} 
                    style={{ 
                      color: '#9ca3af', 
                      textDecoration: 'none', 
                      fontSize: '14px',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.color = '#fbbf24'}
                    onMouseLeave={(e) => e.currentTarget.style.color = '#9ca3af'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '20px', fontWeight: '600' }}>Contact Us</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '1.8' }}>
              <li style={{ marginBottom: '12px' }}>📍 Sky Beach, San Diego, CA</li>
              <li style={{ marginBottom: '12px' }}>📞 +1 (619) 882-7406</li>
              <li style={{ marginBottom: '12px' }}>✉️ Info@khorshidcommunity.org</li>
            </ul>
          </div>

          {/* Social Media & Hours */}
          <div>
            <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '20px', fontWeight: '600' }}>Follow Us</h4>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
              {['📷', '📘', '▶️', '💼'].map((icon, idx) => (
                <span 
                  key={idx}
                  style={{ 
                    fontSize: '28px', 
                    cursor: 'pointer',
                    transition: 'transform 0.2s ease',
                    display: 'inline-block',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {icon}
                </span>
              ))}
            </div>
            <h4 style={{ color: 'white', fontSize: '16px', marginBottom: '16px', fontWeight: '600' }}>Office Hours</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: '14px', lineHeight: '1.8' }}>
              <li>Mon-Fri: 10AM - 6PM</li>
              <li>Sat: 11AM - 4PM</li>
              <li>Sun: Closed (Events only)</li>
            </ul>
          </div>
        </div>

        {/* Copyright Bar */}
        <div style={{
          borderTop: '1px solid #334155',
          paddingTop: '32px',
          textAlign: 'center',
          fontSize: '14px',
        }}>
          <p>© 2025 KhorshidCommunity. All rights reserved. | Built with ❤️ for the community</p>
        </div>
      </div>
    </footer>
  );
}