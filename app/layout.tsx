import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Suryansh — Building Beyond Possible',
  description:
    'I build useful products, experiment with emerging technology, and turn the process into stories worth sharing.',
  keywords: ['Suryansh', 'Portfolio', 'Product Builder', 'Design', 'Technology'],
  authors: [{ name: 'Suryansh' }],
  openGraph: {
    title: 'Suryansh — Building Beyond Possible',
    description:
      'I build useful products, experiment with emerging technology, and turn the process into stories worth sharing.',
    type: 'website',
  },
};

export const viewport: Viewport = {
  themeColor: '#0e1722',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Albert+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Fragment+Mono:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased text-slate-900 bg-[#0e1722] overflow-x-hidden selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
