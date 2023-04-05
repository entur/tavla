import { TTransportMode } from "./graphql/schema";

export type TColumn = "line" | "time" | "destination";

type TBaseTile = {
  placeId: string;
};

export type TQuayTile = {
  type: "quay";
  columns?: TColumn[];
} & TBaseTile;

export type TStopPlaceTile = {
  type: "departure";
  whitelistedTransportModes?: TTransportMode[];
  columns?: TColumn[];
} & TBaseTile;

export type TMapTile = {
  type: "map";
} & TBaseTile;

export type TTile = TStopPlaceTile | TMapTile | TQuayTile;
