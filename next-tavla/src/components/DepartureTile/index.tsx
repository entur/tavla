import { useEffect, useRef, useState } from "react";
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

  const tableRef = useRef<HTMLDivElement | null>(null);
  const [updateNumberOfRows, setUpdateNumberOfRows] = useState(true);
  const [numberOfRows, setNumberOfRows] = useState(0);

  useEffect(() => {
    if (!updateNumberOfRows) return;
    if (!data) return;
    if (!tableRef.current) return;
    if (numberOfRows >= data.stopPlace.estimatedCalls.length) return;

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
      <h3>{data.stopPlace.name}</h3>
      <div style={{ overflow: "hidden", height: "100%" }} ref={tableRef}>
        <Table
          columns={uniqueColumns}
          departures={data.stopPlace.estimatedCalls}
        />
      </div>
    </div>
  );
}
