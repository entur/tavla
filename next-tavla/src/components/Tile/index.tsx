import { useEffect, useState } from "react";
import stopPlaceQuery from "@/graphql/stopPlaceQuery.graphql";
import classes from "./styles.module.css";
import { StopPlaceData } from "@/types/stopPlace";
import { getRelativeTimeString } from "@/utils/time";

export function Tile({ id }: { id: string }) {
  const [data, setData] = useState<StopPlaceData | undefined>(undefined);

  useEffect(() => {
    getStopPlaceData(id).then(setData);

    const interval = setInterval(async () => {
      const data = await getStopPlaceData(id);
      setData(data);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  if (!data) {
    return null;
  }

  return (
    <div className={classes.tile}>
      <h3>{data.name}</h3>
      <ul className={classes.tileTable}>
        <li className={classes.tableRow}>
          <div>Linje</div>
          <div>Destinasjon</div>
          <div>Avgang</div>
        </li>
        {data.estimatedCalls.map((departure) => (
          <li className={classes.tableRow}>
            <div>{departure.serviceJourney.line.publicCode}</div>
            <div>{departure.destinationDisplay.frontText}</div>
            <div>{getRelativeTimeString(departure.expectedDepartureTime)}</div>
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
      mode: "cors",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((jsonRes) => jsonRes.data.stopPlace as StopPlaceData);
}
