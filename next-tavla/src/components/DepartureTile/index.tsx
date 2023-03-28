import { useEffect, useState } from "react";
import stopPlaceQuery from "@/graphql/stopPlaceQuery.graphql";
import { StopPlaceData } from "@/types/stopPlace";
import { TDepartureTile } from "@/types/tile";
import { uniq } from "lodash";
import { Table } from "@/components/Table";

export function DepartureTile({
  placeId,
  columns = ["line", "destination", "time"],
}: TDepartureTile) {
  const [data, setData] = useState<StopPlaceData | undefined>(undefined);
  const uniqueColumns = uniq(columns);

  useEffect(() => {
    getStopPlaceData(placeId).then(setData);

    const interval = setInterval(async () => {
      const data = await getStopPlaceData(placeId);
      setData(data);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [placeId]);

  if (!data) {
    return <div className="tile">Data not found</div>;
  }

  return (
    <div className="tile">
      <h3>{data.name}</h3>
      <div style={{ overflow: "hidden", height: "100%" }}>
        <Table columns={uniqueColumns} departures={data.estimatedCalls} />
      </div>
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
