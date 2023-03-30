import { TDeparture } from "@/types/stopPlace";
import { TColumn } from "@/types/tile";
import React, { useEffect, useRef, useState } from "react";
import classes from "./styles.module.css";
import { DepartureContext } from "./contexts";
import { Time } from "./Time";
import { Destination } from "./Destination";
import { Line } from "./Line";

const headerOptions: Record<TColumn, { name: string; size: number }> = {
  destination: {
    name: "Destinasjon",
    size: 3,
  },
  line: {
    name: "Linje",
    size: 1,
  },
  time: {
    name: "Avgang",
    size: 1,
  },
};

const columnComponents: Record<TColumn, () => JSX.Element> = {
  destination: Destination,
  line: Line,
  time: Time,
};

function Table({
  columns,
  departures,
}: {
  columns: TColumn[];
  departures: TDeparture[];
}) {
  const divRef = useRef<HTMLDivElement>(null);
  const [numberOfRows, setNumberOfRows] = useState<number>(0);

  useEffect(() => {
    setNumberOfRows(departures.length);
  }, [departures.length]);

  useEffect(() => {
    if (
      divRef.current &&
      divRef.current.scrollHeight > divRef.current.clientHeight
    ) {
      setNumberOfRows((old) => old - 1);
    }
  }, [departures.length, numberOfRows]);

  return (
    <div style={{ height: "100%", overflow: 'hidden' }} ref={divRef}>
      <table className={classes.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th style={{ width: `${headerOptions[col].size}%` }} key={col}>
                {headerOptions[col].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {departures.slice(0, numberOfRows).map((departure) => (
            <tr key={departure.serviceJourney.id}>
              <DepartureContext.Provider value={departure}>
                {columns.map((col) => {
                  const Component = columnComponents[col];
                  return <Component key={col} />;
                })}
              </DepartureContext.Provider>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Table };
