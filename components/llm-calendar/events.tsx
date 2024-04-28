import { Badge } from "@/components/ui/badge"

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


export function Events({events}: {events: any}) {
  const { id, date, time, headline, description, type } = events

  return (
    <div className="w-full max-w-sm rounded-lg border divide-y">
      <div className="flex flex-col w-full">
        <div className="flex flex-col p-3">
          <div className="flex items-center space-x-2">
            <CircleIcon className="h-4 w-4 text-green-500" />
            <p className="text-sm font-medium">Breakfast meeting</p>
            <div className="ml-auto">
              <Badge className="text-xs" variant="outline">
                10:00 AM
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CircleIcon className="h-4 w-4 text-blue-500" />
            <p className="text-sm font-medium">Team huddle</p>
            <div className="ml-auto">
              <Badge className="text-xs" variant="outline">
                2:00 PM
              </Badge>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <CircleIcon className="h-4 w-4 text-yellow-500" />
            <p className="text-sm font-medium">Client call</p>
            <div className="ml-auto">
              <Badge className="text-xs" variant="outline">
                4:30 PM
              </Badge>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}