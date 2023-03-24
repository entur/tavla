import { useEffect, useState } from "react";
import stopPlaceQuery from "@/graphql/stopPlaceQuery.graphql";
import classes from "./styles.module.css";
import { Departure, StopPlaceData } from "@/types/stopPlace";
import { getRelativeTimeString } from "@/utils/time";
import { TransportIcon } from "../TransportIcon";
import { transportMode } from "@/types/transport";
import { Column } from "@/types/tile";
import { uniq } from "lodash";

export function Tile({
  stopPlaceID,
  columns = ["line", "destination", "time"],
}: {
  stopPlaceID: string;
  columns?: Column[];
}) {
  const [data, setData] = useState<StopPlaceData | undefined>(undefined);
  const uniqueColumns = uniq(columns);

  useEffect(() => {
    getStopPlaceData(stopPlaceID).then(setData);

    const interval = setInterval(async () => {
      const data = await getStopPlaceData(stopPlaceID);
      setData(data);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [stopPlaceID]);

  if (!data) {
    return null;
  }

  return (
    <div className={classes.tile}>
      <h3>{data.name}</h3>
      <ul className={classes.tileTable}>
        <li className={classes.tableRow}>
          {uniqueColumns.map((column: Column) => (
            <div key={column} style={{ flex: flexWeights[column] }}>
              {column}
            </div>
          ))}
        </li>
        {data.estimatedCalls.map((departure) => (
          <li className={classes.tableRow}>
            {uniqueColumns.map((column: Column) =>
              getColumn(column, departure, flexWeights[column])
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

async function getStopPlaceData(id: string) {
  const query = {
    query: stopPlaceQuery,
    variables: { stopPlaceId: id },
  };
  return await fetch(
    "https://api.staging.entur.io/journey-planner/v3/graphql",
    {
      headers: {
        "Content-Type": "application/json",
        "ET-Client-Name": "tavla-test",
      },
      body: JSON.stringify(query),
      method: "POST",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((jsonRes) => jsonRes.data.stopPlace as StopPlaceData);
}

function getColumn(column: Column, departure: Departure, flex: number) {
  switch (column) {
    case "destination":
      return (
        <div style={{ flex }}>{departure.destinationDisplay.frontText}</div>
      );
    case "line":
      return (
        <div style={{ flex }}>
          <TransportIcon
            transportMode={
              departure.serviceJourney.transportMode as transportMode
            }
            line={departure.serviceJourney.line.publicCode}
            vendor={departure.serviceJourney.line.authority.name}
            presentationColor={
              departure.serviceJourney.line.presentation.colour
            }
          />
        </div>
      );
    case "time":
      return (
        <div style={{ flex }}>
          {getRelativeTimeString(departure.expectedDepartureTime)}
        </div>
      );
  }
}

const flexWeights: Record<Column, number> = {
  line: 1,
  destination: 3,
  time: 1,
};
