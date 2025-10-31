import { nanoid } from "nanoid";
import { DeparturesContext } from "../contexts";
import { TableCell } from "./TableCell";
import { TableColumn } from "./TableColumn";
import { useNonNullContext } from "../../../../Shared/hooks/useNonNullContext";

function Platform() {
  const departures = useNonNullContext(DeparturesContext);

  const platforms = departures.map((departure) => ({
    publicCode: departure.quay.publicCode,
    key: nanoid(),
  }));

  return (
    <TableColumn title="Plattform">
      {platforms.map((platform) => (
        <TableCell key={platform.key}>{platform.publicCode}</TableCell>
      ))}
    </TableColumn>
  );
}

export { Platform };
