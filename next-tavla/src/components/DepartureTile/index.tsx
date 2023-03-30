import { useEffect, useState } from "react";
import { TStopPlaceData } from "@/types/stopPlace";
import { TDepartureTile } from "@/types/tile";
import { uniq } from "lodash";
import { Table } from "@/components/Table";
import { stopPlaceQuery } from "@/graphql/stopPlaceQuery";

export function DepartureTile({
  placeId,
  columns = ["line", "destination", "time"],
}: TDepartureTile) {
  const [data, setData] = useState<TStopPlaceData | undefined>(undefined);
  const uniqueColumns = uniq(columns);

  useEffect(() => {
    stopPlaceQuery({ stopPlaceId: placeId }).then(setData);

    const interval = setInterval(async () => {
      stopPlaceQuery({ stopPlaceId: placeId }).then(setData);
    }, 30000);

    return () => {
      clearInterval(interval);
    };
  }, [placeId]);

  if (!data) {
    return <div className="tile">Data not found</div>;
  }

  return (
    <div className="tile" style={{ display: "flex", flexDirection: "column" }}>
      <h3>{data.stopPlace.name}</h3>
      <Table
        columns={uniqueColumns}
        departures={data.stopPlace.estimatedCalls}
      />
    </div>
  );
}
