
export function Events({events}) {

  return (
    <div>
      <pre>
        {JSON.stringify(events, null, 2)}
      </pre>
    </div>
  )
}