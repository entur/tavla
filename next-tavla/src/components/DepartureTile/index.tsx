import { useCallback } from "react";
import { TDepartureTile } from "@/types/tile";
import { uniq } from "lodash";
import { Table } from "@/components/Table";
import { stopPlaceQuery } from "@/graphql/queries/stopPlace";
import { usePoll } from "@/hooks/usePoll";

export function DepartureTile({
  placeId,
  columns = ["line", "destination", "time"],
}: TDepartureTile) {
  const uniqueColumns = uniq(columns);

  const stopPlaceCallbackQuery = useCallback(
    () => stopPlaceQuery({ stopPlaceId: placeId }),
    [placeId]
  );

  const data = usePoll(stopPlaceCallbackQuery);

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
