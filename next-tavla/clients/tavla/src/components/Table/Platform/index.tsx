import { useNonNullContext } from "@/hooks/useNonNullContext";
import { DepartureContext } from "../contexts";

function Platform() {
  const departure = useNonNullContext(DepartureContext);

  return <td>{departure.quay.publicCode}</td>;
}

export { Platform };
