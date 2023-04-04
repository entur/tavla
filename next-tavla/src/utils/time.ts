export function getRelativeTimeString(timestamp: string) {
  const timeDiff = Date.parse(timestamp) - Date.now();
  if (timeDiff < 60_000) return "Nå";
  else if (timeDiff < 900_000) return Math.floor(timeDiff / 60_000) + " min";
  else return formatTime(timestamp);
}

export function formatTime(timestamp: string) {
  return Intl.DateTimeFormat("no-NB", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  }).format(Date.parse(timestamp));
}
