'use client';

import dynamic from 'next/dynamic';
import { PostList } from './posts';

export { spinner } from '../ui/spinner';
export { BotCard, BotMessage, SystemMessage } from '../message';

const Posts = dynamic(() => import('./posts').then((mod) => mod.PostList), {
  ssr: false,
  loading: () => <div>总结中...</div>,
});

export { Posts };
