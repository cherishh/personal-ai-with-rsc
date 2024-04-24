'use client';

import dynamic from 'next/dynamic';
import { TodaySkeleton } from './today-skeleton';
import { WeekSkeleton } from './week-skeleton';

export { spinner } from '../ui/spinner';
export { BotCard, BotMessage, SystemMessage } from '../message';

const Today = dynamic(() => import('./today').then((mod) => mod.Today), {
  ssr: false,
  loading: () => <TodaySkeleton />,
});

const Week = dynamic(() => import('./week').then((mod) => mod.Week), {
  ssr: false,
  loading: () => <div className='bg-zinc-900 rounded-lg px-4 py-5 text-center text-xs'>Loading WEEK VIEW...</div>,
});

export { Today, Week };
