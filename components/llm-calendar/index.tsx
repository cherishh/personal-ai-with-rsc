'use client';

import dynamic from 'next/dynamic';
import { TodaySkeleton } from './today-skeleton';
import { EventsSkeleton } from './events-skeleton';
import { Event } from './event';

export { spinner } from '../ui/spinner';
export { BotCard, BotMessage, SystemMessage } from '../message';

const Events = dynamic(() => import('./events').then((mod) => mod.Events), {
  ssr: false,
  loading: () => <EventsSkeleton />,
});

const EventView = dynamic(() => import('./event').then((mod) => mod.Event), {
  ssr: false,
  loading: () => <div className='bg-zinc-900 rounded-lg px-4 py-5 text-center text-xs'>Loading Event...</div>,
});

export { Events, EventView };
