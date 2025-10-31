import type { ReactNode } from "react";
import type {
  TDepartureFragment,
  TSituationFragment,
} from "../../../Shared/graphql";
import type {
  BoardWalkingDistanceDB,
  TileColumnDB,
} from "../../../Shared/types/db-types/boards";
import type { TileSituation } from "../../scenarios/Board/utils";
import { Table } from "../../scenarios/Table";
import { StopPlaceQuayDeviation } from "../../scenarios/Table/components/StopPlaceDeviation";
import { TableHeader } from "../../scenarios/Table/components/TableHeader";
import { Tile } from "../../../Shared/components/Tile";
import { TileLoader } from "../TileLoader";
import { DataFetchingFailed, FetchErrorTypes } from "../DataFetchingFailed";
import { TileSituations } from "../../scenarios/Table/components/TileSituations";
import clsx from "clsx";

interface BaseTileProps {
  displayName?: string;
  estimatedCalls: TDepartureFragment[];
  situations: TSituationFragment[];
  uniqueSituations: TileSituation[];
  currentSituationIndex: number;

  isLoading: boolean;
  error?: Error;
  hasData: boolean;

  columns: TileColumnDB[];
  walkingDistance?: BoardWalkingDistanceDB;

  className?: string;
  customHeader?: ReactNode;
  customDeviation?: ReactNode;
}

export const DEFAULT_COLUMNS: TileColumnDB[] = ["line", "destination", "time"];

export const DEFAULT_COMBINED_COLUMNS: TileColumnDB[] = [
  "line",
  "destination",
  "name",
  "platform",
  "time",
];

export function BaseTile({
  displayName,
  estimatedCalls,
  situations,
  uniqueSituations,
  currentSituationIndex,
  isLoading,
  error,
  hasData,
  columns,
  walkingDistance,
  customHeader,
  customDeviation,
  className,
}: BaseTileProps) {
  if (isLoading && !hasData) {
    return (
      <Tile className={className}>
        <TileLoader />
      </Tile>
    );
  }

  if (error || !hasData) {
    return (
      <Tile className={className}>
        <DataFetchingFailed
          timeout={error?.message === FetchErrorTypes.TIMEOUT}
        />
      </Tile>
    );
  }

  if (!estimatedCalls || estimatedCalls.length === 0) {
    return (
      <Tile className={clsx("flex flex-col", className)}>
        <div className="grow overflow-hidden">
          {customHeader ??
            (displayName && (
              <TableHeader
                heading={displayName}
                walkingDistance={walkingDistance}
              />
            ))}
        </div>
        <div className="flex h-full w-full items-center justify-center text-center text-tertiary">
          Ingen avganger i nærmeste fremtid
        </div>
      </Tile>
    );
  }

  return (
    <Tile className={clsx("flex flex-col", className)}>
      <div className="grow overflow-hidden">
        {customHeader ??
          (displayName && (
            <TableHeader
              heading={displayName}
              walkingDistance={walkingDistance}
            />
          ))}

        {customDeviation ?? <StopPlaceQuayDeviation situations={situations} />}

        <Table
          columns={columns}
          departures={estimatedCalls}
          stopPlaceSituations={situations}
          currentVisibleSituationId={
            uniqueSituations?.[currentSituationIndex]?.situation.id
          }
          numberOfVisibleSituations={uniqueSituations?.length}
        />
      </div>

      {uniqueSituations && uniqueSituations.length > 0 && (
        <TileSituations
          situation={uniqueSituations[currentSituationIndex]?.situation}
          currentSituationNumber={currentSituationIndex}
          numberOfSituations={uniqueSituations.length}
          cancelledDeparture={
            uniqueSituations[currentSituationIndex]?.cancellation ?? false
          }
          transportModeList={
            uniqueSituations[currentSituationIndex]?.transportModeList
          }
          publicCodeList={
            uniqueSituations[currentSituationIndex]?.publicCodeList
          }
        />
      )}
    </Tile>
  );
}
