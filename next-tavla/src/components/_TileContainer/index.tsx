import { Tile } from "../Tile";
import classes from "./TileContainer.module.css";

function TileContainer({ id }: { id: string }) {
  return (
    <div className={classes["tile-container"]}>
      <Tile id="NSR:StopPlace:58366" />
      <Tile id="NSR:StopPlace:58404" />
    </div>
  );
}

export { TileContainer };
