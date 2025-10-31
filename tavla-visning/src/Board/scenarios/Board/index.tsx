import React from "react";

import { CombinedTile } from "../CombinedTile";
import { QuayTile } from "../QuayTile";
import { StopPlaceTile } from "../StopPlaceTile";
import type {
  BoardDB,
  BoardTileDB,
} from "../../../Shared/types/db-types/boards";
import { Tile } from "../../../Shared/components/Tile";
import { defaultFontSize, getFontScale } from "./utils";

function BoardTile({
  tileSpec,
  className,
}: {
  tileSpec: BoardTileDB;
  className?: string;
}) {
  switch (tileSpec.type) {
    case "stop_place":
      return <StopPlaceTile {...tileSpec} className={className} />;
    case "quay":
      return <QuayTile {...tileSpec} className={className} />;
  }
}

function Board({ board }: { board: BoardDB }) {
  if (!board.tiles || !board.tiles.length)
    return (
      <Tile className="flex h-full items-center justify-center">
        <p>Du har ikke lagt til noen stoppesteder ennå.</p>
      </Tile>
    );

  const combinedTiles = getCombinedTiles(board);
  const separateTiles = getSeparateTiles(board);
  const totalTiles = separateTiles.length + combinedTiles.length;
  const fontScaleClass = getFontScale(
    board.meta?.fontSize || defaultFontSize(board)
  );
  const colsStyle = {
    "--cols": String(totalTiles),
  } as React.CSSProperties;

  const baseGridClass = "grid h-full gap-2.5 overflow-hidden";
  const fallbackFlexClass =
    "supports-[not(display:grid)]:flex supports-[not(display:grid)]:*:m-2.5";
  const responsiveGridClass =
    "max-sm:overflow-y-scroll xs:grid-cols-1 sm:grid-cols-[repeat(auto-fit,_minmax(33%,_1fr))]";
  const largeScreenGridClass =
    "3xl:[grid-template-columns:repeat(var(--cols),minmax(0,1fr))]";

  const gridClassName = `${baseGridClass} ${fallbackFlexClass} ${responsiveGridClass} ${largeScreenGridClass} ${fontScaleClass}`;

  const hasOddTileCount = totalTiles % 2 === 1;

  const getRowSpanClass = (tileIndex: number) => {
    if (!hasOddTileCount || tileIndex !== 0) return undefined;
    return "sm:max-3xl:row-span-2";
  };

  return (
    <div
      data-transport-palette={board.transportPalette}
      data-theme={board.theme}
      style={colsStyle}
      className={gridClassName}
    >
      {separateTiles.map((tile, index) => {
        return (
          <BoardTile
            key={index}
            tileSpec={tile}
            className={getRowSpanClass(index)}
          />
        );
      })}
      {combinedTiles.map((combinedTile, index) => (
        <CombinedTile key={index} combinedTile={combinedTile} />
      ))}
    </div>
  );
}

export { Board };

function getCombinedTiles(board: BoardDB) {
  const combinedTileIds = board.combinedTiles?.map((c) => c.ids) ?? [];
  return (
    combinedTileIds?.map((ids) =>
      board.tiles.filter((t) => ids.includes(t.uuid))
    ) || []
  );
}

function getSeparateTiles(board: BoardDB) {
  const combinedTileIds = board.combinedTiles?.map((c) => c.ids) ?? [];
  return board.tiles.filter((t) => !combinedTileIds?.flat().includes(t.uuid));
}
