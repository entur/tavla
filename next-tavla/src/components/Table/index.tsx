import { TDeparture } from "@/types/graphql";
import { TColumn } from "@/types/tile";
import React from "react";
import classes from "./styles.module.css";
import { DepartureContext } from "./contexts";
import { Time } from "./Time";
import { Destination } from "./Destination";
import { Line } from "./Line";
import { Platform } from "./Platform";

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
  platform: {
    name: "Plattform",
    size: 1,
  },
};

const columnComponents: Record<TColumn, () => JSX.Element> = {
  destination: Destination,
  line: Line,
  time: Time,
  platform: Platform,
};

function Table({
  columns,
  departures,
}: {
  columns: TColumn[];
  departures: TDeparture[];
}) {
  return (
    <div className={classes.container}>
      <table className={classes.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                style={{
                  width: `${headerOptions[col].size}%`,
                }}
                key={col}
              >
                {headerOptions[col].name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {departures.map((departure) => (
            <tr
              key={`${departure.serviceJourney.id}_${departure.aimedDepartureTime}`}
            >
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
