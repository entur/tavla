import { nanoid } from "nanoid";
import { TableCell } from "../TableCell";
import { TableColumn } from "../TableColumn";
import { FormattedTime } from "./components/FormattedTime";
import { useNonNullContext } from "../../../../../Shared/hooks/useNonNullContext";
import { DeparturesContext } from "../../contexts";

function AimedTime() {
  const departures = useNonNullContext(DeparturesContext);

  const time = departures.map((departure) => ({
    aimedDepartureTime: departure.aimedDepartureTime,
    key: nanoid(),
  }));

  return (
    <TableColumn title="Planlagt" className="text-right">
      {time.map((t) => (
        <TableCell key={t.key}>
          <FormattedTime time={t.aimedDepartureTime} />
        </TableCell>
      ))}
    </TableColumn>
  );
}

export { AimedTime };
