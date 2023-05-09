import { useCallback } from "react";
import { TStopPlaceTile } from "@/types/tile";
import { Table } from "@/components/Table";
import { stopPlaceQuery } from "@/graphql/queries/stopPlace";
import { usePoll } from "@/hooks/usePoll";
import classes from "./styles.module.css";

export function StopPlaceTile({
  placeId,
  columns,
  whitelistedLines,
  whitelistedTransportModes,
}: TStopPlaceTile) {
  const stopPlaceCallbackQuery = useCallback(
    () =>
      stopPlaceQuery({
        stopPlaceId: placeId,
        whitelistedTransportModes,
        whitelistedLines,
      }),
    [placeId, whitelistedTransportModes, whitelistedLines]
  );

  const data = usePoll(stopPlaceCallbackQuery);

  if (!data) {
    return <div className="tile">Loading data</div>;
  }

  if (!data.stopPlace) {
    return <div className="tile">Data not found</div>;
  }

  return (
    <div className={classes.stopPlaceTile}>
      <h3>{data.stopPlace.name}</h3>
      <Table columns={columns} departures={data.stopPlace.estimatedCalls} />
    </div>
  );
}
