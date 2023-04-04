import { useCallback } from "react";
import { TQuayTile } from "@/types/tile";
import { uniq } from "lodash";
import { Table } from "@/components/Table";
import { quayQuery } from "@/graphql/queries/quay";
import { usePoll } from "@/hooks/usePoll";
import classes from "./styles.module.css";

export function QuayTile({
  placeId,
  columns = ["line", "destination", "time"],
}: TQuayTile) {
  const uniqueColumns = uniq(columns);

  const quayCallbackQuery = useCallback(
    () => quayQuery({ quayId: placeId }),
    [placeId]
  );

  const data = usePoll(quayCallbackQuery);

  if (!data) {
    return <div className="tile">Loading data</div>;
  }

  if (!data.quay) {
    return <div className="tile">Data not found</div>;
  }

  return (
    <div className="tile" style={{ display: "flex", flexDirection: "column" }}>
      <div className={classes.heading}>
        <h3>{data.quay.name}</h3>
        <h4>
          {data.quay.publicCode} {data.quay.description}
        </h4>
      </div>
      <Table columns={uniqueColumns} departures={data.quay.estimatedCalls} />
    </div>
  );
}
