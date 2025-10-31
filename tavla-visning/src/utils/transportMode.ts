import type { TTransportMode } from "../Shared/types/graphql-schema";
import { SmallTravelTag } from "../Shared/components/TravelTag";
import { HomeIcon, MapPinIcon } from "@entur/icons";
import { uniq } from "lodash";

export type TLineFragment = {
  __typename?: "Line";
  id: string;
  publicCode: string | null;
  name: string | null;
  transportMode: TTransportMode | null;
};

export function sortLineByPublicCode(a: TLineFragment, b: TLineFragment) {
  if (!a || !a.publicCode || !b || !b.publicCode) return 1;

  const containsLetters = /[a-zæøåA-ZÆØÅ]/;
  const aContainsLetters = containsLetters.test(a.publicCode);
  const bContainsLetters = containsLetters.test(b.publicCode);

  if (aContainsLetters && !bContainsLetters) return 1;
  else if (!aContainsLetters && bContainsLetters) return -1;

  return a.publicCode.localeCompare(b.publicCode, "no-NB", {
    numeric: true,
  });
}

export function sortPublicCodes(a: string, b: string) {
  if (!a || !b) return 1;

  const containsLetters = /[a-zæøåA-ZÆØÅ]/;
  const aContainsLetters = containsLetters.test(a);
  const bContainsLetters = containsLetters.test(b);

  if (aContainsLetters && !bContainsLetters) return 1;
  else if (!aContainsLetters && bContainsLetters) return -1;

  return a.localeCompare(b, "no-NB", {
    numeric: true,
  });
}

export function transportModeNames(
  transportMode: TTransportMode | null | undefined,
) {
  switch (transportMode) {
    case "air":
      return "Fly";
    case "bus":
      return "Buss";
    case "cableway":
      return "Kabelbane";
    case "water":
      return "Båt";
    case "funicular":
      return "Taubane";
    case "lift":
      return "Heis";
    case "rail":
      return "Tog";
    case "metro":
      return "T-bane";
    case "tram":
      return "Trikk";
    case "trolleybus":
      return "Trolley-buss";
    case "monorail":
      return "Enskinnebane";
    case "coach":
      return "Langdistansebuss";
    case "taxi":
      return "Taxi";
    case "unknown":
      return "Ukjent";
    default:
      return null;
  }
}

export type TCategory =
  | "onstreetBus"
  | "onstreetTram"
  | "airport"
  | "railStation"
  | "metroStation"
  | "busStation"
  | "coachStation"
  | "tramStation"
  | "harbourPort"
  | "ferryPort"
  | "ferryStop"
  | "liftStation"
  | "vehicleRailInterchange"
  | "poi"
  | "vegadresse";

export function categoryToTransportmode(category: TCategory): TTransportMode {
  switch (category) {
    case "onstreetBus":
    case "busStation":
    case "coachStation":
      return "bus";
    case "tramStation":
    case "onstreetTram":
      return "tram";
    case "railStation":
      return "rail";
    case "harbourPort":
    case "ferryPort":
    case "ferryStop":
      return "water";
    case "liftStation":
      return "lift";
    case "metroStation":
      return "metro";
    case "airport":
      return "air";
    case "vehicleRailInterchange":
    default:
      return "unknown";
  }
}

export function getVenueIcon(category: TCategory) {
  switch (category) {
    case "vegadresse":
      return HomeIcon;
    default:
      return MapPinIcon;
  }
}

const travelTags = (category: TCategory[]) => {
  const transportModes = uniq(
    category.map((mode) => categoryToTransportmode(mode)),
  );

  return transportModes.map((tm, index) => {
    // unique key for each travel tag
    const UniqueSmallTravelTag = () =>
      SmallTravelTag({
        transportMode: tm,
      });
    UniqueSmallTravelTag.displayName = `TravelTag-${tm}-${index}`;
    return UniqueSmallTravelTag;
  });
};

export function getIcons(layer?: string, category?: TCategory[]) {
  if (!layer || !category) return;
  if (layer !== "venue")
    return uniq(uniq(category).map((mode) => getVenueIcon(mode)));
  return travelTags(category);
}

export function isEmptyOrSpaces(str?: string) {
  return str === undefined || str?.match(/^ *$/) !== null;
}
export function isOnlyWhiteSpace(str: string) {
  if (str === undefined || str === null || str === "") return false;

  return str.trim() === "";
}
