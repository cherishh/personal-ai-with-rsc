'use client';

import { add, millisecondsToHours, millisecondsToMinutes, isEqual, set } from 'date-fns';
import { useEffect, useState } from 'react';

// // 1/4 hour
// const EVENT_MIN_HEIGHT = 72 / 4;
// // 1.5 hour
// const EVENT_MAX_HEIGHT = 72 * 1.5;

const HOUR_HEIGHT_SM = 36;
const HOUR_HEIGHT_LG = 72;
const MIN_HEIGHT_SM = 9;
const MIN_HEIGHT_LG = 18;

function generateHourlyTimeRange(dateRange: [string, string]): string[] {
  const [startDateStr, endDateStr] = dateRange;
  const startDate = new Date(startDateStr);
  const endDate = new Date(endDateStr);

  // 检查并处理跨日情况
  if (endDate <= startDate) {
    endDate.setDate(endDate.getDate() + 1);
  }

  // 向下取整起始时间到最近的整点
  startDate.setMinutes(0, 0, 0);

  // 向上取整结束时间到最近的整点
  endDate.setMinutes(0, 0, 0);
  if (endDate.getTime() !== new Date(endDateStr).getTime()) {
    endDate.setHours(endDate.getHours() + 1);
  }

  const result: string[] = [];
  let currentTime = startDate;

  while (currentTime <= endDate) {
    // 将小时数转换为AM/PM格式
    const hours = currentTime.getHours();
    const period = hours < 12 ? 'AM' : 'PM';
    const formattedHour = `${hours % 12 === 0 ? 12 : hours % 12}${period}`;
    result.push(formattedHour);

    // 向前递增一个小时
    currentTime.setHours(currentTime.getHours() + 1);
  }

  return result;
}

function add1hourMore(timeArr: string[]): string[] {
  const lastOne = parseFloat(timeArr[timeArr.length - 1]);
  if (lastOne === 12 && timeArr[timeArr.length - 1].slice(-2) === 'AM'){
    timeArr.push('1AM');
    return timeArr;
  }
  timeArr.push(`${lastOne + 1}${timeArr[timeArr.length - 1].slice(-2)}`);
  return timeArr;
}

function getOffsetTop(startDate: Date, isLgBlock: 1 | 0): number {
  const minutes = startDate.getMinutes();
  const offset = minutes * (isLgBlock ? HOUR_HEIGHT_LG : HOUR_HEIGHT_SM) / 60;
  return offset;
}

export function Event({
  time,
  headline,
  description,
}: {
  time: [string, string];
  headline: string;
  description: string;
}) {
  const [eventHeight, setEventHeight] = useState(0);
  const [hourRange, setHourRange] = useState<string[]>([]);
  const [isLgBlock, setBlockType] = useState<1 | 0>(1);
  const [eventMt, setEventMt] = useState(0);

  useEffect(() => {
    // todo 再拿一次events，把在时间范围内的其他事件也渲染出来

    // 计算事件的高度
    const eventStart = new Date(time[0]);
    const eventEnd = new Date(time[1]);
    const eventTotalMinutes = millisecondsToMinutes(eventEnd.getTime() - eventStart.getTime());
    const eHeight =
      eventTotalMinutes < 180 ? (eventTotalMinutes / 60) * HOUR_HEIGHT_LG : (eventTotalMinutes / 60) * HOUR_HEIGHT_SM;
    const isLgBlock = eventTotalMinutes < 180 ? 1 : 0;
    const eventMt = getOffsetTop(eventStart, isLgBlock);
    setBlockType(isLgBlock);
    setEventHeight(eHeight);
    setEventMt(eventMt);
    // 计算时间轴范围
    setHourRange(add1hourMore(generateHourlyTimeRange(time)));
    console.log(eventStart, eventEnd, eventTotalMinutes, isLgBlock, 'event-----------------');
  }, [time]);

  return (
    <div className='w-5/6'>
      <div className=' mb-10'>
        {time[0]} - {time[1]}
      </div>
      <div className='flex flex-row gap-2' style={{ animation: '0.5s ease 0s 1 normal forwards running fadein' }}>
        <div className='flex flex-col gap-1 justify-between relative -top-2'>
          {hourRange.map((hour, idx) => (
            <div
              key={hour}
              className={`text-sm text-zinc-400 ${idx === hourRange.length - 1 ? '' : !isLgBlock ? 'min-h-9' : 'min-h-[72px]'}`}
            >
              {hour}
            </div>
          ))}
        </div>
        <div className='flex flex-col gap-1 w-full'>
          <div
            className='p-2 rounded-lg bg-emerald-100 overflow-x-auto flex items-center'
            style={{ height: eventHeight, marginTop: eventMt, minHeight: isLgBlock ? MIN_HEIGHT_LG : MIN_HEIGHT_SM }}
          >
            <div>
              <div className={`capitalize text-emerald-800 ${(!isLgBlock || eventHeight < 36) ? 'text-sm' : ''}`}>{headline}</div>
              {!(!isLgBlock || eventHeight < 36) && <div className='text-emerald-800'>{description}</div>}
            </div>
          </div>
          <div
            className='p-2 rounded-lg bg-pink-100 overflow-x-auto flex items-center'
            style={{ minHeight: !isLgBlock ? HOUR_HEIGHT_SM : HOUR_HEIGHT_LG }}
          >
            <div>
              <div className='capitalize text-pink-800'>Date</div>
              <div className='text-pink-800'>Drinks at The Bunker</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
