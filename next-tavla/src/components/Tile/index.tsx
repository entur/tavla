import { TTile } from "@/types/tile";
import { StopPlaceTile } from "../StopPlaceTile";
import { MapTile } from "../MapTile";
import { QuayTile } from "../QuayTile";

function Tile({ tileSpec }: { tileSpec: TTile }) {
  switch (tileSpec.type) {
    case "stop_place":
      return <StopPlaceTile {...tileSpec} />;
    case "quay":
      return <QuayTile {...tileSpec} />;
    case "map":
      return <MapTile {...tileSpec} />;
  }
}

export { Tile };
