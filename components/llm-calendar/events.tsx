
export function Events({events}: {events: any}) {

  return (
    <div>
      <pre>
        {JSON.stringify(events, null, 2)}
      </pre>
    </div>
  )
}