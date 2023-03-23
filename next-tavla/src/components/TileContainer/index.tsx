import { Tile } from "../Tile";
import styles from "./styles.css";

function TileContainer({ id }: { id: string }) {
  return (
    <div className="tile-container">
      <Tile id="NSR:StopPlace:58366" />
      <Tile id="NSR:StopPlace:58404" />
    </div>
  );
}

export { TileContainer };
