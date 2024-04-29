import Link from 'next/link';

import { IconGitHub, IconSeparator, LoadingSpinner } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';



export async function Header() {
  return (
    <header className='sticky top-0 z-50 flex items-center justify-between w-full px-4 border-b h-14 shrink-0 bg-background backdrop-blur-xl'>
      <span className='inline-flex items-center home-links whitespace-nowrap'>
        <a href='https://zhongxi.app' rel='noopener' target='_blank'>
          <IconGitHub className='w-5 h-5 sm:h-6 sm:w-6' />
        </a>
        <IconSeparator className='w-6 h-6 text-muted-foreground/20' />
        <Link href='/'>
          <span className='text-lg font-bold'>
            zhongxi.app
          </span>
        </Link>
      </span>
      <div className='flex items-center justify-end space-x-2'></div>
      <Button>login</Button>
    </header>
  );
}
