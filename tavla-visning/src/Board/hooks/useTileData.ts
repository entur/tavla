import {
  GetQuayQuery,
  StopPlaceQuery,
  type TDepartureFragment,
  type TSituationFragment,
} from "../../Shared/graphql";
import { useQueries, useQuery } from "../../Shared/hooks/useQuery";
import type {
  BoardTileDB,
  QuayTileDB,
  StopPlaceTileDB,
} from "../../Shared/types/db-types/boards";
import { isNotNullOrUndefined } from "../../Shared/utils/typeguards";
import {
  combineSituations,
  getAccumulatedTileSituations,
  type TileSituation,
} from "../scenarios/Board/utils";
import { useCycler } from "../scenarios/Table/useCycler";

interface BaseTileData {
  displayName?: string;
  estimatedCalls: TDepartureFragment[];
  situations: TSituationFragment[];
  uniqueSituations: TileSituation[];
  currentSituationIndex: number;
  isLoading: boolean;
  error?: Error;
  hasData: boolean;
}

export function useQuayTileData({
  placeId,
  whitelistedLines,
  whitelistedTransportModes,
  offset,
  displayName,
}: QuayTileDB): BaseTileData {
  const { data, isLoading, error } = useQuery(
    GetQuayQuery,
    {
      quayId: placeId,
      whitelistedLines,
      whitelistedTransportModes,
    },
    { poll: true, offset: offset ?? 0 }
  );

  const combinedStopPlaceQuaySituations: TSituationFragment[] =
    combineSituations([
      ...(data?.quay?.stopPlace.situations ?? []),
      ...(data?.quay?.situations ?? []),
    ]);

  const uniqueSituations = getAccumulatedTileSituations(
    data?.quay?.estimatedCalls,
    combinedStopPlaceQuaySituations
  );

  const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000);

  const heading: string = [data?.quay?.name, data?.quay?.publicCode]
    .filter(isNotNullOrUndefined)
    .join(" ");

  return {
    displayName: displayName ?? heading,
    estimatedCalls: data?.quay?.estimatedCalls ?? [],
    situations: combinedStopPlaceQuaySituations,
    uniqueSituations: uniqueSituations ?? [],
    currentSituationIndex,
    isLoading,
    error,
    hasData: !!data?.quay,
  };
}

export function useStopPlaceTileData({
  placeId,
  whitelistedLines,
  whitelistedTransportModes,
  offset,
  displayName,
}: StopPlaceTileDB): BaseTileData {
  const { data, isLoading, error } = useQuery(
    StopPlaceQuery,
    {
      stopPlaceId: placeId,
      whitelistedTransportModes,
      whitelistedLines,
    },
    { poll: true, offset: offset ?? 0 }
  );

  const uniqueSituations = getAccumulatedTileSituations(
    data?.stopPlace?.estimatedCalls,
    data?.stopPlace?.situations
  );

  const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000);

  return {
    displayName: displayName ?? data?.stopPlace?.name ?? "",
    estimatedCalls: data?.stopPlace?.estimatedCalls ?? [],
    situations: data?.stopPlace?.situations ?? [],
    uniqueSituations: uniqueSituations ?? [],
    currentSituationIndex,
    isLoading,
    error,
    hasData: !!data?.stopPlace,
  };
}

export function useCombinedTileData(combinedTile: BoardTileDB[]): BaseTileData {
  const quayQueries = combinedTile
    .filter(({ type }) => type === "quay")
    .map((tile) => ({
      query: GetQuayQuery,
      variables: {
        quayId: tile.placeId,
        whitelistedTransportModes: tile.whitelistedTransportModes,
        whitelistedLines: tile.whitelistedLines,
      },
      options: { offset: tile.offset, poll: true },
    }));

  const stopPlaceQueries = combinedTile
    .filter(({ type }) => type === "stop_place")
    .map((tile) => ({
      query: StopPlaceQuery,
      variables: {
        stopPlaceId: tile.placeId,
        whitelistedTransportModes: tile.whitelistedTransportModes,
        whitelistedLines: tile.whitelistedLines,
      },
      options: { offset: tile.offset, poll: true },
    }));

  const {
    data: quayData,
    error: quayError,
    isLoading: quayLoading,
  } = useQueries(quayQueries);

  const {
    data: stopPlaceData,
    error: stopPlaceError,
    isLoading: stopPlaceLoading,
  } = useQueries(stopPlaceQueries);

  // Combine all estimated calls and sort them
  const estimatedCalls = [
    ...(stopPlaceData?.flatMap(
      (data) => data.stopPlace?.estimatedCalls ?? []
    ) ?? []),
    ...(quayData?.flatMap((data) => data.quay?.estimatedCalls ?? []) ?? []),
  ];

  const sortedEstimatedCalls = estimatedCalls.sort((a, b) => {
    const timeA = new Date(a.expectedDepartureTime).getTime();
    const timeB = new Date(b.expectedDepartureTime).getTime();
    return (
      (isNaN(timeA) ? Infinity : timeA) - (isNaN(timeB) ? Infinity : timeB)
    );
  });

  // Combine situations with origin information
  const situations: TSituationFragment[] = [
    ...(stopPlaceData?.flatMap((data) => {
      const origin = data?.stopPlace?.name ?? "";
      const situations = data?.stopPlace?.situations ?? [];
      return situations.map((situation) => ({
        origin,
        ...situation,
      }));
    }) ?? []),
    ...(quayData?.flatMap((data) => {
      const origin = data.quay?.name ?? "";
      const situations = data?.quay?.stopPlace?.situations ?? [];
      return situations.map((situation) => ({
        origin,
        ...situation,
      }));
    }) ?? []),
  ];

  const combinedSituations: TSituationFragment[] =
    combineSituations(situations);

  const uniqueSituations = getAccumulatedTileSituations(
    sortedEstimatedCalls,
    combinedSituations
  );

  const currentSituationIndex = useCycler(uniqueSituations ?? [], 10000);

  return {
    displayName: undefined,
    estimatedCalls: sortedEstimatedCalls,
    situations: combinedSituations,
    uniqueSituations: uniqueSituations ?? [],
    currentSituationIndex,
    isLoading: quayLoading || stopPlaceLoading,
    error: quayError || stopPlaceError,
    hasData: !!(quayData?.length || stopPlaceData?.length),
  };
}
