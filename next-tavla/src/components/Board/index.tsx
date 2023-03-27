import { Tile } from "@/components/Tile";
import classes from "./styles.module.css";

function Board({ id }: { id: string }) {
  return (
    <div className={classes.board}>
      <Tile stopPlaceID="NSR:StopPlace:58366" />
    </div>
  );
}

export { Board };
