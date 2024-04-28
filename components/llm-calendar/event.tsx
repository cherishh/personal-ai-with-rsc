'use client';

import { add, millisecondsToHours } from "date-fns";
import { useEffect } from "react";

export function Event({
  date,
  time,
  headline,
  description,
}: {
  date: string;
  time: string[];
  headline: string;
  description: string;
}) {

  useEffect(() => {
    // todo 再拿一次events，把在时间范围内的其他事件也渲染出来
  })

  const rangeStart = add(new Date(time[0]), { hours: -1 });
  const rangeEnd = add(new Date(time[time.length - 1]), { hours: 1 });
  const range = millisecondsToHours(rangeEnd.getTime() - rangeStart.getTime());
  console.log(rangeStart, rangeEnd, range, 'range-----------------');


  return (
    <div>
      <div className='flex flex-row gap-2' style={{ animation: '0.5s ease 0s 1 normal forwards running fadein' }}>
        <div className='flex flex-col gap-2 justify-between'>
          <div className='text-sm text-zinc-400 min-h-9'>4PM</div>
          <div className='text-sm text-zinc-400 min-h-9'>5PM</div>
          <div className='text-sm text-zinc-400 min-h-9'>6PM</div>
          <div className='text-sm text-zinc-400 min-h-9'>7PM</div>
          <div className='text-sm text-zinc-400 min-h-9'>8PM</div>
        </div>
        <div className='flex flex-col gap-1 w-full'>
          <div className='p-2 rounded-lg flex-grow bg-emerald-100 overflow-x-auto' style={{maxHeight: 72 }}>
            <div className='capitalize text-emerald-800'>{headline}</div>
            <div className='text-emerald-800'>{description}</div>
          </div>
          <div className='p-2 rounded-lg flex-grow bg-pink-100 overflow-x-auto' style={{maxHeight: 72 }}>
            <div className='capitalize text-pink-800'>Drinks at Wild Colonial</div>
            <div className='text-pink-800'>6-7 PM</div>
          </div>
        </div>
      </div>
    </div>
  );
}
