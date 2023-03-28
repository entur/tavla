import { Tile } from "@/components/Tile";
import { firebase, TSettings } from "@/types/settings";
import classes from "./styles.module.css";

function Board({ id }: { id: string }) {
  const settings: TSettings | undefined = firebase[id];

  if (!settings) return <div>Tavle not found</div>;

  return (
    <div className={classes.board}>
      {settings.tiles.map((tile) => {
        return <Tile tileSpec={tile} />;
      })}
    </div>
  );
}

export { Board };
