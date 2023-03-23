import { transportMode } from "@/types/transport";
import { getTransportModeColor } from "@/utils/colors";

import {
  BicycleIcon,
  BusIcon,
  CablewayIcon,
  CarferryIcon,
  FerryIcon,
  FunicularIcon,
  HelicopterIcon,
  MetroIcon,
  MobilityIcon,
  PlaneIcon,
  TaxiIcon,
  TrainIcon,
  TramIcon,
  WalkIcon,
} from "@entur/icons";

function TransportIcon({
  line,
  vendor,
  transportMode,
  presentationColor,
}: {
  line: string;
  vendor: string;
  transportMode: transportMode;
  presentationColor?: string;
}): JSX.Element {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        width: "fit-content",
        height: "100%",
        padding: "5px",
        borderRadius: "5px",
        backgroundColor: getTransportModeColor(
          transportMode,
          vendor,
          line,
          presentationColor
        ) as string,
      }}
    >
      {getTransportIcon(transportMode)} {line}
    </div>
  );
}

function getTransportIcon(transportMode: transportMode) {
  switch (transportMode) {
    case "metro":
      return <MetroIcon color="white" alt="Metro icon" />;
    case "bus":
      return <BusIcon color="white" />;
    case "plane":
      return <PlaneIcon color="white" />;
    case "helicopter":
      return <HelicopterIcon color="white" />;
    case "tram":
      return <TramIcon color="white" />;
    case "funicular":
      return <FunicularIcon color="white" />;
    case "cableway":
      return <CablewayIcon color="white" />;
    case "taxi":
      return <TaxiIcon color="white" />;
    case "bicycle":
      return <BicycleIcon color="white" />;
    case "walk":
      return <WalkIcon color="white" />;
    case "rail":
      return <TrainIcon color="white" />;
    case "ferry":
      return <FerryIcon color="white" />;
    case "carferry":
      return <CarferryIcon color="white" />;
    case "mobility":
      return <MobilityIcon color="white" />;
  }
}

export { TransportIcon };
