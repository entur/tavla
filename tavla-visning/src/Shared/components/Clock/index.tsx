"use client";
import { useEffect, useState } from "react";

function Clock() {
  const [currentTime, setCurrentTime] = useState<string>();

  useEffect(() => {
    const formatTime = () => {
      const now = new Date();
      return new Intl.DateTimeFormat("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Europe/Oslo",
      }).format(now);
    };

    setCurrentTime(formatTime());

    const intervalId = setInterval(() => setCurrentTime(formatTime()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  return <span className="text-[1.5625em] text-primary">{currentTime}</span>;
}

export { Clock };
