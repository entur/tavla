import type {
  TDepartureFragment,
  TSituationFragment,
} from "../../../Shared/graphql";
import type {
  BoardDB,
  BoardFontSize,
} from "../../../Shared/types/db-types/boards";
import type { TTransportMode } from "../../../Shared/types/graphql-schema";
import { sortPublicCodes } from "../../../utils/transportMode";

export function getFontScale(fontSize: BoardFontSize | undefined) {
  switch (fontSize) {
    case "small":
      return "text-em-xs";
    case "medium":
      return "text-em-base";
    case "large":
      return "text-em-xl";
    default:
      return "text-em-base";
  }
}
export function defaultFontSize(board: BoardDB) {
  if (!board.tiles || board.tiles.length === 0) return "medium";

  switch (board.tiles.length) {
    case 1:
      return "large";
    case 2:
      return "medium";
    default:
      return "small";
  }
}

/**
 * Removes situations from the departure that are also present on the tile stop place to remove duplicate situations,
 * @param stopPlaceSituations - An array of situations representing stop place situations to exclude.
 * @param departureSituations - An array of situations associated with a specific departure.
 * @returns A filtered array of situations from the departure, excluding any situations that match those in the stopPlaceSituations.
 */
export function removeStopPlaceSituations(
  departureSituations: TSituationFragment[],
  stopPlaceSituations?: TSituationFragment[]
) {
  if (!stopPlaceSituations || !departureSituations) {
    return departureSituations ?? [];
  }

  const filteredSituations = departureSituations.filter(
    (departureSituation) =>
      !stopPlaceSituations.some(
        (stopPlaceSituation) => departureSituation.id === stopPlaceSituation.id
      )
  );

  return filteredSituations;
}

/**
 * Combines an array of `TSituationFragment` objects by merging those with the same `id`.
 * If multiple situations share the same `id`, their `origin` fields are concatenated,
 * separated by commas, and sorted alphabetically.
 *
 * @param situations - An array of `TSituationFragment` objects to be combined.
 * @returns An array of combined `TSituationFragment` objects with unique `id`s.
 */
export function combineSituations(situations: TSituationFragment[]) {
  const situationById: { [id: string]: TSituationFragment } = {};

  situations.map((situation) => {
    const id = situation.id;
    if (situationById[id]) {
      const existingOrigins = situationById[id].origin
        ?.split(", ")
        .concat([situation.origin ?? ""])
        .sort();

      situationById[id].origin = existingOrigins?.join(", ");
    } else {
      situationById[id] = situation;
    }
  });

  return Object.values(situationById);
}

type TileSituationMap = Map<
  string,
  {
    situation: TSituationFragment;
    cancellation: boolean;
    publicCodeSet: Set<string>;
    transportModeSet: Set<TTransportMode>;
  }
>;

export type TileSituation = {
  situation: TSituationFragment;
  cancellation: boolean;
  publicCodeList: string[];
  transportModeList: TTransportMode[];
};

/**
 * Aggregates and deduplicates situations from a list of departures, excluding stop place situations.
 *
 * For each departure, it removes situations that are already present in the stop place situations,
 * then accumulates all unique situations across departures. Each accumulated situation includes
 * a list of associated public codes and transport modes, as well as cancellation status.
 *
 * @param departures - Optional array of departure fragments to process.
 * @param stopPlaceSituations - Optional array of stop place situations to exclude from departures.
 * @returns An array of accumulated tile situations
 */
export function getAccumulatedTileSituations(
  departures?: TDepartureFragment[],
  stopPlaceSituations?: TSituationFragment[]
): TileSituation[] {
  const filteredDepartures =
    departures &&
    departures
      .map((departure) => ({
        situations: removeStopPlaceSituations(
          departure.situations,
          stopPlaceSituations
        ),
        publicCode: departure.serviceJourney.line.publicCode,
        transportMode: departure.serviceJourney.transportMode ?? "unknown",
        cancellation: departure.cancellation,
      }))
      .filter((situation) => situation.situations.length !== 0);

  if (!filteredDepartures || filteredDepartures.length === 0) return [];

  const accumulatedSituations = filteredDepartures
    .flatMap((departure) =>
      departure.situations.map((situation) => ({
        id: situation.id,
        situation: situation,
        cancellation: departure.cancellation,
        publicCode: departure.publicCode,
        transportMode: departure.transportMode,
      }))
    )
    .reduce((situationMap, currentSituation) => {
      const existingSituation = situationMap.get(currentSituation.id);
      const situationAlreadyExists = existingSituation !== undefined;
      if (situationAlreadyExists) {
        if (currentSituation.publicCode) {
          existingSituation.publicCodeSet.add(currentSituation.publicCode);
        }
        existingSituation.transportModeSet.add(currentSituation.transportMode);
      } else {
        situationMap.set(currentSituation.id, {
          situation: currentSituation.situation,
          cancellation: currentSituation.cancellation,
          publicCodeSet: new Set(
            currentSituation.publicCode ? [currentSituation.publicCode] : []
          ),
          transportModeSet: new Set<TTransportMode>([
            currentSituation.transportMode,
          ]),
        });
      }
      return situationMap;
    }, new Map() as TileSituationMap);

  return Array.from(accumulatedSituations.values()).map((entry) => ({
    situation: entry.situation,
    cancellation: entry.cancellation,
    publicCodeList: Array.from(entry.publicCodeSet).sort(sortPublicCodes),
    transportModeList: Array.from(entry.transportModeSet),
  }));
}
