'use client'
 
import { useEffect, useState } from 'react';
import { useCompletion } from 'ai/react';

export function PostList({posts}) {

  // const { completion } = useCompletion({
  //   api: '/api/social/summary',
  // });

  return (
    <div>
      {JSON.stringify(posts, null, 2)}
    </div>
  )
}