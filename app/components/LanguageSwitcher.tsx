// app/components/LanguageSwitcher.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  
  // Determine current language
  const isPersian = pathname.startsWith('/fa') || pathname.startsWith('/prs');
  const currentLang = isPersian ? 'فارسی' : 'English';
  
  // Get the alternate path
  const getAlternatePath = () => {
    if (isPersian) {
      // Remove /fa or /prs prefix
      return pathname.replace(/^\/(fa|prs)/, '') || '/';
    } else {
      // Add /fa prefix
      return `/fa${pathname}`;
    }
  };
  
  const alternatePath = getAlternatePath();
  
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-yellow-600 transition-colors"
      >
        <span>{currentLang}</span>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <Link
              href="/"
              className={`block px-4 py-2 text-sm hover:bg-gray-50 ${!isPersian ? 'text-yellow-600 font-semibold' : 'text-gray-700'}`}
              onClick={() => setIsOpen(false)}
            >
              English
            </Link>
            <Link
              href={alternatePath}
              className={`block px-4 py-2 text-sm hover:bg-gray-50 ${isPersian ? 'text-yellow-600 font-semibold' : 'text-gray-700'}`}
              onClick={() => setIsOpen(false)}
            >
              فارسی
            </Link>
          </div>
        </>
      )}
    </div>
  );
}