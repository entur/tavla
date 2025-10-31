import { nanoid } from "nanoid";
import { TableCell } from "../TableCell";
import { TableColumn } from "../TableColumn";
import { FormattedTime } from "./components/FormattedTime";
import { useNonNullContext } from "../../../../../Shared/hooks/useNonNullContext";
import { DeparturesContext } from "../../contexts";

function ArrivalTime() {
  const departures = useNonNullContext(DeparturesContext);

  const time = departures.map((departure) => ({
    expectedArrivalTime: departure.expectedArrivalTime,
    key: nanoid(),
  }));

  return (
    <TableColumn title="Ankomst" className="text-right">
      {time.map((t) => (
        <TableCell key={t.key}>
          <FormattedTime time={t.expectedArrivalTime} />
        </TableCell>
      ))}
    </TableColumn>
  );
}

export { ArrivalTime };
