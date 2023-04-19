import { TMapTile } from "@/types/tile";

function MapTile({ placeId }: TMapTile) {
  return <div className="tile">{placeId}</div>;
}

export { MapTile };
