import { Badge } from "@/components/ui/badge"
import { formatISO9075 } from 'date-fns';
import { getId } from "@/lib/utils";
import type { IEvent } from "@/types/llm-calendar";

function CircleIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
    </svg>
  )
}

const colorMap: { [key: string]: string } = {
  work: 'text-green-500',
  personal: 'text-blue-500',
  family: 'text-yellow-500',
}

export function Events({events}: {events: IEvent[]}) {

  const getAMorPM = (time: string) => {
    const hours = new Date(time).getHours();
    return hours < 12 ? 'AM' : 'PM';
  }

  if (events.length === 0) {
    return (
      <div className='w-full max-w-sm rounded-lg border divide-y'>
        <div className='flex flex-col w-full'>
          <div className='flex flex-col p-3'>
            <div className='flex items-center space-x-2'>
              <p className='text-sm font-medium'>没有日程😆🎉</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className='w-full max-w-sm rounded-lg border divide-y'>
      <div className='flex flex-col w-full'>
        <div className='flex flex-col p-3'>
          {events.map((event) => (
            <div key={event.id} className='flex items-center space-x-2 mb-2'>
              <CircleIcon className={`h-4 w-4 ${colorMap[event.type]}`} />
              <p className='text-sm font-medium'>{event.headline}</p>
              <div className='ml-auto'>
                <Badge className='text-xs' variant='outline'>
                  {formatISO9075(new Date(event.time[0]), { representation: 'time' }).slice(0, -3)} {getAMorPM(event.time[0])}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}