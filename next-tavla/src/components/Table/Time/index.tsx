import { useNonNullContext } from "@/hooks/useNonNullContext";
import { getRelativeTimeString } from "@/utils/time";
import { DepartureContext } from "../contexts";

function Time() {
  const departure = useNonNullContext(DepartureContext);

  return <td>{getRelativeTimeString(departure.expectedDepartureTime)}</td>;
}

export { Time };
