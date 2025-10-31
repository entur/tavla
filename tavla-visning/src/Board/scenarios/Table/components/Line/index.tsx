import { nanoid } from "nanoid";
import { useNonNullContext } from "../../../../../Shared/hooks/useNonNullContext";
import { DeparturesContext } from "../../contexts";
import { TableCell } from "../TableCell";
import { TableColumn } from "../TableColumn";
import { TravelTag } from "../../../../../Shared/components/TravelTag";
import { getAirPublicCode } from "../../../../../Shared/utils/publicCode";

function Line() {
  const departures = useNonNullContext(DeparturesContext);

  const lines = departures.map((departure) => ({
    transportMode: departure.serviceJourney.transportMode ?? "unknown",
    transportSubmode: departure.serviceJourney.transportSubmode ?? undefined,
    publicCode: departure.serviceJourney.line.publicCode ?? "",
    key: nanoid(),
    id: departure.serviceJourney.id ?? "",
    cancelled: departure.cancellation,
  }));

  return (
    <TableColumn title="Linje">
      {lines.map((line) => (
        <TableCell key={line.key}>
          <div className="flex w-full items-center justify-start gap-2 pr-2">
            <TravelTag
              transportMode={line.transportMode}
              transportSubmode={line.transportSubmode}
              publicCode={
                line.transportMode === "air"
                  ? getAirPublicCode(line.id) ?? ""
                  : line.publicCode
              }
              cancelled={line.cancelled}
            />
          </div>
        </TableCell>
      ))}
    </TableColumn>
  );
}

export { Line };
