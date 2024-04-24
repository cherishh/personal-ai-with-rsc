
export function Event({time, headline, description}) {

  return (
    <div>
      {time[0]}, {time[1]} - {headline} - {description}
    </div>
  )
}