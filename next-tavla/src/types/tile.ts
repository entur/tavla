export type TColumn = "line" | "time" | "destination";

type TBaseTile = {
  placeId: string;
};

export type TQuayTile = {
  type: "quay";
  columns?: TColumn[];
} & TBaseTile;

export type TDepartureTile = {
  type: "departure";
  columns?: TColumn[];
} & TBaseTile;

export type TMapTile = {
  type: "map";
} & TBaseTile;

export type TTile = TDepartureTile | TMapTile | TQuayTile;
