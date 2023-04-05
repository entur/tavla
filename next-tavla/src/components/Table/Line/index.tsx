import { useNonNullContext } from "@/hooks/useNonNullContext";
import { TransportIcon } from "../../TransportIcon";
import { DepartureContext } from "../contexts";

function Line() {
  const departure = useNonNullContext(DepartureContext);

  return (
    <td>
      <TransportIcon
        transportMode={departure.serviceJourney.transportMode}
        line={departure.serviceJourney.line.publicCode}
        vendor={departure.serviceJourney.line.authority?.name}
        presentationColor={departure.serviceJourney.line.presentation?.colour}
      />
    </td>
  );
}
export { Line };
