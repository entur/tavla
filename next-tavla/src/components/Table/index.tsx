import { Departure } from "@/types/stopPlace";
import { Column } from "@/types/tile";
import { transportMode } from "@/types/transport";
import { getRelativeTimeString } from "@/utils/time";
import React, { useContext } from "react";
import { TransportIcon } from "../TransportIcon";
import classes from "./styles.module.css";

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

const columnComponents: Record<Column, () => JSX.Element | null> = {
  destination: Destination,
  line: Line,
  time: Time,
};

const DepartureContext = React.createContext<Departure | null>(null);

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
            <th style={{ width: `${headerOptions[col].size}%` }}>
              {headerOptions[col].name}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {departures.map((departure) => (
          <DepartureContext.Provider value={departure}>
            <tr key={departure.serviceJourney.id}>
              {columns.map((col) => {
                const Component = columnComponents[col];
                return <Component />;
              })}
            </tr>
          </DepartureContext.Provider>
        ))}
      </tbody>
    </table>
  );
}

function Time() {
  const departure = useContext(DepartureContext);

  if (!departure) return null;

  return <td>{getRelativeTimeString(departure.expectedDepartureTime)}</td>;
}

function Destination() {
  const departure = useContext(DepartureContext);

  if (!departure) return null;

  return <td>{departure.destinationDisplay.frontText}</td>;
}

function Line() {
  const departure = useContext(DepartureContext);

  if (!departure) return null;

  return (
    <td>
      <TransportIcon
        transportMode={departure.serviceJourney.transportMode as transportMode}
        line={departure.serviceJourney.line.publicCode}
        vendor={departure.serviceJourney.line.authority.name}
        presentationColor={departure.serviceJourney.line.presentation.colour}
      />
    </td>
  );
}

export { Table };
