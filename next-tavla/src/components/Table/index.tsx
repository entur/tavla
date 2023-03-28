import { Departure } from "@/types/stopPlace";
import { Column } from "@/types/tile";
import React from "react";
import classes from "./styles.module.css";
import { DepartureContext } from "./contexts";
import { Time } from "./Time";
import { Destination } from "./Destination";
import { Line } from "./Line";

const headerOptions: Record<Column, { name: string; size: number }> = {
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

const columnComponents: Record<Column, () => JSX.Element> = {
  destination: Destination,
  line: Line,
  time: Time,
};

function Table({
  columns,
  departures,
}: {
  columns: Column[];
  departures: Departure[];
}) {
  return (
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
        {departures.map((departure) => (
          <tr key={departure.serviceJourney.id}>
            <DepartureContext.Provider value={departure}>
              {columns.map((col) => {
                const Component = columnComponents[col];
                return <Component key={col} />;
              })}
            </DepartureContext.Provider>
          </tr>
        ))}
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="metro" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="bus" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="plane" />
        </tr>
        <tr>
          <TransportIcon
            vendor="undefined"
            line="1"
            transportMode="helicopter"
          />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="tram" />
        </tr>
        <tr>
          <TransportIcon
            vendor="undefined"
            line="1"
            transportMode="funicular"
          />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="cableway" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="taxi" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="bicycle" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="walk" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="rail" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="ferry" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="carferry" />
        </tr>
        <tr>
          <TransportIcon vendor="undefined" line="1" transportMode="mobility" />
        </tr>
      </tbody>
    </table>
  );
}

export { Table };
