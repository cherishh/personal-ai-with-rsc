import type { Metadata } from 'next';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import { Analytics } from '@vercel/analytics/react';
import { Toaster } from '@/components/ui/toaster';
import { IconGitHub } from '@/components/ui/icons';
import './globals.css';

import { AI } from './action';
import { Header } from '@/components/header';
import { Providers } from '@/components/providers';

const meta = {
  title: 'Baby Jarvis by Zhongxi',
  description: 'Demo of a real AI personal assistant.',
};
export const metadata: Metadata = {
  ...meta,
  title: {
    default: 'Baby Jarvis by Zhongxi',
    template: `%s - Baby Jarvis, a real AI personal assistant`,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`font-sans antialiased ${GeistSans.variable} ${GeistMono.variable}`}>
        <Toaster />
        <AI>
          <Providers attribute='class' defaultTheme='system' enableSystem disableTransitionOnChange>
            <div className='relative flex flex-col min-h-screen'>
              {/* <Header /> */}
              <a href='https://github.com/cherishh/personal-ai-with-rsc' rel='noopener' target='_blank' className=' fixed top-3 right-3'>
                <IconGitHub className='w-5 h-5 sm:h-6 sm:w-6' />
              </a>
              <main className='flex flex-col flex-1 bg-muted/50 dark:bg-background'>{children}</main>
            </div>
          </Providers>
        </AI>
        <Analytics />
      </body>
    </html>
  );
}
