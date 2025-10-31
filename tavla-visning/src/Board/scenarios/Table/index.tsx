import { Paragraph } from "@entur/typography";
import { isArray } from "lodash";
import { Destination, Name } from "./components/Destination";
import { Deviation } from "./components/Deviation";
import { Line } from "./components/Line";
import { Platform } from "./components/Platform";
import { AimedTime } from "./components/Time/AimedTime";
import { ArrivalTime } from "./components/Time/ArrivalTime";
import { ExpectedTime } from "./components/Time/ExpectedTime";
import { DeparturesContext } from "./contexts";
import type {
  TDepartureFragment,
  TSituationFragment,
} from "../../../Shared/graphql";
import type { TileColumnDB } from "../../../Shared/types/db-types/boards";

function Table({
  departures,
  columns,
  stopPlaceSituations,
  currentVisibleSituationId,
  numberOfVisibleSituations,
}: {
  departures: TDepartureFragment[];
  columns?: TileColumnDB[];
  stopPlaceSituations?: TSituationFragment[];
  currentVisibleSituationId?: string;
  numberOfVisibleSituations?: number;
}) {
  if (!columns || !isArray(columns))
    return (
      <div className="flex shrink-0">
        Du har ikke lagt til noen kolonner ennå
      </div>
    );

  if (departures.length === 0)
    return (
      <div className="flex h-full w-full flex-col items-center justify-center pb-4 text-center text-em-sm">
        <Paragraph className="!text-primary sm:pb-8">
          Ingen avganger de neste 24 timene.
        </Paragraph>
      </div>
    );
  return (
    <div className="flex flex-col">
      <div className="flex shrink-0">
        <DeparturesContext.Provider value={departures}>
          <Deviation
            currentVisibleSituationId={currentVisibleSituationId}
            stopPlaceSituations={stopPlaceSituations}
            numberOfShownSituations={numberOfVisibleSituations}
          />
          {columns.includes("aimedTime") && <AimedTime />}
          {columns.includes("arrivalTime") && <ArrivalTime />}
          {columns.includes("line") && <Line />}
          {columns.includes("destination") && <Destination />}
          {columns.includes("name") && <Name />}
          {columns.includes("platform") && <Platform />}
          {columns.includes("time") && <ExpectedTime />}
        </DeparturesContext.Provider>
      </div>
    </div>
  );
}

export { Table };
