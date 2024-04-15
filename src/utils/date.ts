export const dateStringFromTimestamp = (timestamp: number) => 
  Intl.DateTimeFormat("sv-SE", { dateStyle: "short", timeStyle: "short"}).format(timestamp)