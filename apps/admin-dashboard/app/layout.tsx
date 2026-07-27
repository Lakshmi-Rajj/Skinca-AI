import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Skincare Platform Operations & Admin Dashboard',
  description: 'Enterprise Skincare Recommendation SaaS Admin Operations Suite',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-stone-50 text-stone-900 antialiased">{children}</body>
    </html>
  );
}
