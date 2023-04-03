import { useEffect, useState } from "react";

function usePoll<T>(func: () => Promise<T>, ms: number = 30000) {
  const [data, setData] = useState<T | undefined>();

  useEffect(() => {
    func().then(setData);

    const interval = setInterval(async () => {
      func().then(setData);
    }, ms);

    return () => {
      clearInterval(interval);
    };
  }, [func, ms]);

  return data;
}

export { usePoll };
