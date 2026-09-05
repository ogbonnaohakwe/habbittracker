import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zenith - Micro-Habit Tracker',
  description: 'Frictionless micro-habit tracking with real-time web & mobile synchronization.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-brand-background text-brand-slate antialiased">
        {children}
      </body>
    </html>
  );
}
