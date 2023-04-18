import { TMapTile } from "@/types/tile";
import Mapbox from "react-map-gl";

function MapTile({ longitude, latitude, zoom }: TMapTile) {
  return (
    <div className="tile">
      <Mapbox
        zoom={zoom}
        longitude={longitude}
        latitude={latitude}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle={process.env.NEXT_PUBLIC_MAPBOX_STYLE}
        interactive={false}
        reuseMaps
      />
    </div>
  );
}

export { MapTile };
