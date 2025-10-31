import type { BoardTileDB } from "../../../Shared/types/db-types/boards";
import { BaseTile, DEFAULT_COMBINED_COLUMNS } from "../../components/BaseTile";
import { useCombinedTileData } from "../../hooks/useTileData";
import { CombinedTileDeviation } from "../Table/components/StopPlaceDeviation";

export function CombinedTile({
  combinedTile,
  className,
}: {
  combinedTile: BoardTileDB[];
  className?: string;
}) {
  const tileData = useCombinedTileData(combinedTile);

  return (
    <BaseTile
      {...tileData}
      columns={DEFAULT_COMBINED_COLUMNS}
      customDeviation={
        <CombinedTileDeviation situations={tileData.situations} />
      }
      className={className}
    />
  );
}
