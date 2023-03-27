import { useNonNullContext } from "@/hooks/useNonNullContext";
import { DepartureContext } from "../contexts";

function Destination() {
  const departure = useNonNullContext(DepartureContext);

  return <td>{departure.destinationDisplay.frontText}</td>;
}
export { Destination };
