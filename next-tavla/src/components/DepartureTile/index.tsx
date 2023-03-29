import { useEffect, useRef, useState } from "react";
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

  const tableRef = useRef<HTMLDivElement | null>(null);
  const [updateNumberOfRows, setUpdateNumberOfRows] = useState(true);
  const [numberOfRows, setNumberOfRows] = useState(0);

  useEffect(() => {
    if (!updateNumberOfRows) return;
    if (!data) return;
    if (!tableRef.current) return;
    if (numberOfRows >= data.estimatedCalls.length) return;

    const element = tableRef.current;

    if (element.scrollHeight === element.clientHeight) {
      setNumberOfRows(numberOfRows + 1);
    } else {
      setNumberOfRows(numberOfRows - 1);
      setUpdateNumberOfRows(false);
    }
  }, [updateNumberOfRows, data, numberOfRows]);

  if (!data) {
    return <div className="tile">Data not found</div>;
  }

  return (
    <div className="tile" style={{ display: "flex", flexDirection: "column" }}>
      <h3>{data.name}</h3>
      <div style={{ overflow: "hidden", height: "100%" }} ref={tableRef}>
        <Table
          columns={uniqueColumns}
          departures={data.estimatedCalls.slice(0, numberOfRows)}
        />
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
