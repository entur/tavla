export function getRelativeTimeString(timestamp: string) {
  const timeDiff = Date.parse(timestamp) - Date.now();
  if (timeDiff < 60_000) return "Nå";
  else if (timeDiff < 900_000) return Math.floor(timeDiff / 60_000) + " min";
  else
    return Intl.DateTimeFormat("no-NB", { timeStyle: "short" }).format(
      Date.parse(timestamp)
    );
}
