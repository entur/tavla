import type {
  StopPlaceTileDB,
  TileColumnDB,
} from "../../../Shared/types/db-types/boards";
import { BaseTile } from "../../components/BaseTile";
import { useStopPlaceTileData } from "../../hooks/useTileData";

export function StopPlaceTile(props: StopPlaceTileDB & { className?: string }) {
  const tileData = useStopPlaceTileData(props);
  const DEFAULT_COLUMNS: TileColumnDB[] = ["line", "destination", "time"];

  return (
    <BaseTile
      className={props.className}
      {...tileData}
      columns={props.columns ?? DEFAULT_COLUMNS}
      walkingDistance={props.walkingDistance}
    />
  );
}
