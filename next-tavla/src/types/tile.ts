import { TTransportMode } from "./graphql/schema";

export type TColumn = "line" | "time" | "destination" | "platform";

type TBaseTile = {
  placeId: string;
};

export type TQuayTile = {
  type: "quay";
  columns?: TColumn[];
  whitelistedLines?: string[];
  whitelistedTransportModes?: TTransportMode[];
} & TBaseTile;

export type TStopPlaceTile = {
  type: "departure";
  columns?: TColumn[];
  whitelistedLines?: string[];
  whitelistedTransportModes?: TTransportMode[];
} & TBaseTile;

export type TMapTile = {
  type: "map";
} & TBaseTile;

export type TTile = TStopPlaceTile | TMapTile | TQuayTile;
