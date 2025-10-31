import type { QuayTileDB } from "../../../Shared/types/db-types/boards";
import { BaseTile, DEFAULT_COLUMNS } from "../../components/BaseTile";
import { useQuayTileData } from "../../hooks/useTileData";

export function QuayTile(props: QuayTileDB & { className?: string }) {
  const tileData = useQuayTileData(props);

  return (
    <BaseTile
      {...tileData}
      columns={props.columns ?? DEFAULT_COLUMNS}
      walkingDistance={props.walkingDistance}
      className={props.className}
    />
  );
}
