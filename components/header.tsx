import Link from 'next/link';

import { IconGitHub, IconSeparator, IconSparkles, IconVercel } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';

export function LoadingSpinnerSVG() {
  return (
    <svg width='24' height='24' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
      <path d='M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm0,19a8,8,0,1,1,8-8A8,8,0,0,1,12,20Z' opacity='.25' />
      <path className='test' d='M10.14,1.16a11,11,0,0,0-9,8.92A1.59,1.59,0,0,0,2.46,12,1.52,1.52,0,0,0,4.11,10.7a8,8,0,0,1,6.66-6.61A1.42,1.42,0,0,0,12,2.69h0A1.57,1.57,0,0,0,10.14,1.16Z' />
    </svg>
  );
}

export async function Header() {
  return (
    <header className='sticky top-0 z-50 flex items-center justify-between w-full px-4 border-b h-14 shrink-0 bg-background backdrop-blur-xl'>
      <span className='inline-flex items-center home-links whitespace-nowrap'>
        <a href='https://vercel.com' rel='noopener' target='_blank'>
          <IconVercel className='w-5 h-5 sm:h-6 sm:w-6' />
        </a>
        <IconSeparator className='w-6 h-6 text-muted-foreground/20' />
        <Link href='/'>
          <span className='text-lg font-bold'>
            <IconSparkles className='inline mr-0 w-4 sm:w-5 mb-0.5' />
            AI
          </span>
        </Link>
      </span>
      <div className='flex items-center justify-end space-x-2'></div>
      <LoadingSpinnerSVG />
    </header>
  );
}
