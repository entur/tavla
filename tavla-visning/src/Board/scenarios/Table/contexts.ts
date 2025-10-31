import React from "react";
import type { BoardTileDB } from "../../../Shared/types/db-types/boards";
import type { TDepartureFragment } from "../../../Shared/graphql";

const DeparturesContext = React.createContext<TDepartureFragment[] | undefined>(
  undefined
);

const TileContext = React.createContext<BoardTileDB | undefined>(undefined);

export { DeparturesContext, TileContext };
