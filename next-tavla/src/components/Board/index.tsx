import { Tile } from "../Tile";
import classes from "./styles.module.css";

function Board({ id }: { id: string }) {
  return (
    <div className={classes.board}>
      <Tile id="NSR:StopPlace:337" />
      <Tile id="NSR:StopPlace:58366" />
    </div>
  );
}

export { Board };
