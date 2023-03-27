import { useEffect, useState } from "react";
import stopPlaceQuery from "@/graphql/stopPlaceQuery.graphql";
import classes from "./styles.module.css";
import { StopPlaceData } from "@/types/stopPlace";
import { Column } from "@/types/tile";
import { uniq } from "lodash";
import { Table } from "@/components/Table";

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
    }, 30000);

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
      <Table columns={uniqueColumns} departures={data.estimatedCalls} />
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
