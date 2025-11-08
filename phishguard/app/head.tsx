// app/layout.tsx or app/head.tsx
export const metadata = {
  title: 'Phishguard',
  description: 'Progressive Web App with Next.js',
  manifest: '/manifest.json',
  themeColor: '#0070f3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/icons/icon-192x192.png" />
        <meta name="theme-color" content="#0070f3" />
      </head>
      <body>{children}</body>
    </html>
  );
}
