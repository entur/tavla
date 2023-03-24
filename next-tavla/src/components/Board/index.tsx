import { Tile } from "../Tile";
import classes from "./styles.module.css";

function Board({ id }: { id: string }) {
  return (
    <div className={classes.board}>
      <Tile stopPlaceID="NSR:StopPlace:337" />
      <Tile
        stopPlaceID="NSR:StopPlace:58366"
        columns={["time", "line", "destination"]}
      />
    </div>
  );
}

export { Board };
