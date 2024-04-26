
export function Event({date, time, headline, description}: {date: string, time: string[], headline: string, description: string}) {

  return (
    <div>
      <div>{date} - {time[0]}, {time[1]}</div>
      <div>{headline} - {description}</div>
    </div>
  )
}