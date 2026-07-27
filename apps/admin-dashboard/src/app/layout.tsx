import React from 'react';
import '../styles/globals.css';

export const metadata = {
  title: 'Skincare Platform - B2B Admin Dashboard',
  description: 'Manage skincare product catalog, INCI formulations, and widget settings.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
