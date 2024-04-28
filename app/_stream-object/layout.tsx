import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import { GenerateItineraryAI } from './generate-itinerary';
import '../globals.css';

const meta = {
  title: 'Baby Jarvis',
  description:
    'Demo of a real AI personal assistant.',
};
export const metadata: Metadata = {
  ...meta,
  title: {
    default: 'Baby Jarvis',
    template: `%s - Baby Jarvis, the AI personal assistant.`,
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
  twitter: {
    ...meta,
    card: 'summary_large_image',
    site: '@vercel',
  },
  openGraph: {
    ...meta,
    locale: 'en-US',
    type: 'website',
  },
};

export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}
      >
        <GenerateItineraryAI>{children}</GenerateItineraryAI>
      </body>
    </html>
  );
}
