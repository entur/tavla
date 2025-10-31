import type { TSituationFragment } from "../../../../Shared/graphql";
import { useNonNullContext } from "../../../../Shared/hooks/useNonNullContext";
import { removeStopPlaceSituations } from "../../Board/utils";
import { DeparturesContext } from "../contexts";
import { DeviationIcon } from "./DeviationIcon";
import { TableCell } from "./TableCell";
import { TableColumn } from "./TableColumn";

type Situation = {
  type: "situation";
  situations: TSituationFragment[];
  isHighlighted: boolean;
};

type Cancellation = {
  type: "cancellation";
  isHighlighted: boolean;
};

type NoDeviation = { type: "no-deviation" };

type Deviation = Situation | Cancellation | NoDeviation;

function Deviation({
  currentVisibleSituationId,
  stopPlaceSituations,
  numberOfShownSituations,
}: {
  currentVisibleSituationId?: string;
  stopPlaceSituations?: TSituationFragment[];
  numberOfShownSituations?: number;
}) {
  const departures = useNonNullContext(DeparturesContext);

  const deviations: Deviation[] = departures.map((departure) => {
    const isHighlighted =
      numberOfShownSituations && numberOfShownSituations > 0
        ? departure.situations.some((s) => s.id === currentVisibleSituationId)
        : true;

    const filteredSituations =
      removeStopPlaceSituations(departure.situations, stopPlaceSituations) ??
      [];

    if (departure.cancellation) {
      return { type: "cancellation", isHighlighted };
    }
    if (filteredSituations.length > 0) {
      return {
        type: "situation",
        situations: filteredSituations,
        isHighlighted,
      };
    }
    return { type: "no-deviation" };
  });

  return (
    <TableColumn>
      {deviations.map((deviation, index) => (
        <TableCell key={`${deviation.type}-${index}`}>
          <DeviationCell deviation={deviation} />
        </TableCell>
      ))}
    </TableColumn>
  );
}

function DeviationCell({ deviation }: { deviation: Deviation }) {
  if (deviation.type === "no-deviation") {
    return null;
  }

  return (
    <div className="flex items-center justify-center" style={{ height: "3em" }}>
      <DeviationIcon
        deviationType={deviation.type}
        isHighlighted={deviation.isHighlighted}
      />
    </div>
  );
}

export { Deviation };
