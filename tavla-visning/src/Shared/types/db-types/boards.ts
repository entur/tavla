import type { TTransportMode } from "../../types/graphql-schema";

export type BoardDB = {
  id?: BoardId;
  meta: BoardMetaDB;
  tiles: BoardTileDB[];
  combinedTiles?: CombinedTilesDB[];
  theme?: BoardTheme;
  footer?: BoardFooter;
  transportPalette?: TransportPalette;
  hideLogo?: boolean;
  hideClock?: boolean;
};

export type BoardId = string;

export type BoardFooter = {
  footer?: string;
};

export type CombinedTilesDB = { ids: BoardId[] };

export type BoardTheme = "dark" | "light";
export type TransportPalette = "default" | "blue-bus" | "green-bus";

export type BoardMetaDB = {
  title?: string;
  created?: number;
  lastActive?: number;
  dateModified?: number;
  fontSize?: BoardFontSize;
  location?: LocationDB;
};

export type BoardFontSize = "small" | "medium" | "large";

export type Coordinate = { lat: number; lng: number };
export type LocationDB = {
  name?: string;
  coordinate?: Coordinate;
};

export type BaseTileDB = {
  placeId: string;
  name: string;
  uuid: string;
  whitelistedLines?: string[];
  whitelistedTransportModes?: TTransportMode[];
  walkingDistance?: BoardWalkingDistanceDB;
  offset?: number;
  displayName?: string;
  columns?: TileColumnDB[];
};

export const TileColumns = {
  aimedTime: "Planlagt",
  arrivalTime: "Ankomst",
  line: "Linje",
  destination: "Destinasjon",
  name: "Stoppested",
  platform: "Plattform",
  time: "Forventet",
} as const;

export type TileColumnDB = keyof typeof TileColumns;

export type QuayTileDB = {
  type: "quay";
} & BaseTileDB;
export type StopPlaceTileDB = {
  type: "stop_place";
} & BaseTileDB;

export type BoardTileDB = StopPlaceTileDB | QuayTileDB;

export type BoardWalkingDistanceDB = {
  distance?: number;
  visible?: boolean;
};
