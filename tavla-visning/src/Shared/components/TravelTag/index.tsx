import { isOnlyWhiteSpace } from "../../../utils/transportMode";
import type {
  TTransportMode,
  TTransportSubmode,
} from "../../types/graphql-schema";
import { TransportIcon } from "../TransportIcon";

const transportModeNames: Record<TTransportMode, string> = {
  air: "Fly",
  bus: "Buss",
  cableway: "Taubane",
  water: "Båt",
  funicular: "Kabelbane",
  lift: "Heis",
  rail: "Tog",
  metro: "T-bane",
  tram: "Trikk",
  trolleybus: "Trolley-buss",
  monorail: "Énskinnebane",
  coach: "Langdistansebuss",
  taxi: "Taxi",
  unknown: "Ukjent",
};

function TravelTag({
  transportMode,
  publicCode,
  transportSubmode,
  cancelled,
}: {
  transportMode: TTransportMode;
  publicCode: string;
  transportSubmode?: TTransportSubmode;
  cancelled?: boolean;
}) {
  const colorMode = transportSubmode?.startsWith("airport")
    ? "air"
    : transportMode;

  const travelTagBackround = `bg-${colorMode}${
    cancelled && transportMode !== "unknown" ? "-transparent" : ""
  }`;
  const iconPublicCodeColor =
    cancelled && transportMode !== "unknown"
      ? `text-${colorMode}`
      : "text-background";

  return (
    <div
      aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
      className={`flex h-full w-full items-center justify-between rounded-sm pl-2 ${travelTagBackround}`}
    >
      <TransportIcon
        className={`h-em-2 w-em-2 ${iconPublicCodeColor}`}
        transportMode={transportMode}
        transportSubmode={transportSubmode}
      />
      <div
        className={`flex h-full w-full flex-row items-center justify-center font-semibold ${iconPublicCodeColor}`}
      >
        {publicCode}
      </div>
    </div>
  );
}

function SmallTravelTag({
  transportMode,
  publicCode,
  icons = true,
}: {
  transportMode?: TTransportMode | null;
  publicCode?: string | null;
  icons?: boolean;
}) {
  if (!transportMode) return null;
  return (
    <div
      aria-label={`${transportModeNames[transportMode]} - linje ${publicCode}`}
      className={`flex h-5 items-center justify-between rounded-sm p-1 font-bold text-background bg-${
        transportMode ?? "unknown"
      } mx-0.5`}
      key={`${transportMode}${publicCode}`}
    >
      {icons && (
        <TransportIcon
          className={`h-6 fill-background ${
            publicCode && !isOnlyWhiteSpace(publicCode)
              ? "w-6 max-sm:hidden sm:block lg:hidden xl:block"
              : "block w-4"
          }`}
          transportMode={transportMode}
        />
      )}
      {publicCode && !isOnlyWhiteSpace(publicCode) && (
        <div className="align-center flex w-full justify-center text-[0.65rem]">
          {publicCode}
        </div>
      )}
    </div>
  );
}

export { SmallTravelTag, TravelTag };
