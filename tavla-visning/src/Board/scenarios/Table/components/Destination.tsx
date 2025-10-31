import { nanoid } from "nanoid";
import { DeparturesContext } from "../contexts";
import { TableCell } from "./TableCell";
import { TableColumn } from "./TableColumn";
import { useNonNullContext } from "../../../../Shared/hooks/useNonNullContext";
import { isNotNullOrUndefined } from "../../../../Shared/utils/typeguards";

function Destination() {
  const departures = useNonNullContext(DeparturesContext);

  const destinations = departures.map((departure) => ({
    destination: departure.destinationDisplay?.frontText ?? "",
    via:
      departure.destinationDisplay?.via
        ?.filter(isNotNullOrUndefined)
        .join(", ") ?? "",
    key: nanoid(),
  }));
  return (
    <div className="grow overflow-hidden">
      <TableColumn title="Destinasjon">
        {destinations.map((destination) => (
          <TableCell key={destination.key} className="flex align-middle">
            <div className="line-clamp-1 overflow-ellipsis hyphens-auto text-em-xl2 leading-em-base">
              {destination.via
                ? `${destination.destination} via ${destination.via}`
                : destination.destination}
            </div>
          </TableCell>
        ))}
      </TableColumn>
    </div>
  );
}

function Name() {
  const departures = useNonNullContext(DeparturesContext);

  return (
    <div className="grow overflow-hidden">
      <TableColumn title="Stoppested">
        {departures.map((departure) => (
          <TableCell key={nanoid()}>
            <div className="line-clamp-2 justify-items-end overflow-ellipsis hyphens-auto text-em-base/em-base">
              {departure.quay.name}
            </div>
          </TableCell>
        ))}
      </TableColumn>
    </div>
  );
}

export { Destination, Name };
