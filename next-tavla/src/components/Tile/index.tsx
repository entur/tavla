import { TTile } from "@/types/tile";
import { DepartureTile } from "../DepartureTile";
import { MapTile } from "../MapTile";

function Tile({ tileSpec }: { tileSpec: TTile }) {
  switch (tileSpec.type) {
    case "departure":
      return <DepartureTile {...tileSpec} />;
    case "map":
      return <MapTile {...tileSpec} />;
  }
}

export { Tile };
