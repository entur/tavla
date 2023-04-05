import { colors as EnturColors } from "@entur/tokens";
import { TTransportMode } from "@/types/graphql/schema";
import { TTheme } from "@/types/settings";

type TTransportLineColors = { [line: string]: string };

type TTransportTypeColor = string | TTransportLineColors;

type TTransportTypeColors = Record<TTransportMode, TTransportTypeColor>;

export const colors: {
  default: TTransportTypeColors;
  contrast: TTransportTypeColors;
} = {
  default: {
    metro: EnturColors.transport.default.metro,
    bus: EnturColors.transport.default.bus,
    tram: EnturColors.transport.default.tram,
    funicular: EnturColors.transport.default.funicular,
    cableway: EnturColors.transport.default.cableway,
    rail: EnturColors.transport.default.train,
    air: EnturColors.transport.default.plane,
    coach: EnturColors.transport.default.bus,
    lift: EnturColors.transport.default.cableway,
    monorail: EnturColors.transport.default.tram,
    trolleybus: EnturColors.transport.default.bus,
    unknown: EnturColors.transport.default.walk,
    water: EnturColors.transport.default.ferry,
  },
  contrast: {
    metro: EnturColors.transport.contrast.metro,
    bus: EnturColors.transport.contrast.bus,
    tram: EnturColors.transport.contrast.tram,
    funicular: EnturColors.transport.contrast.funicular,
    cableway: EnturColors.transport.contrast.cableway,
    rail: EnturColors.transport.contrast.train,
    air: EnturColors.transport.contrast.plane,
    coach: EnturColors.transport.contrast.bus,
    lift: EnturColors.transport.contrast.cableway,
    monorail: EnturColors.transport.contrast.tram,
    trolleybus: EnturColors.transport.contrast.bus,
    unknown: EnturColors.transport.contrast.walk,
    water: EnturColors.transport.contrast.ferry,
  },
};

type thirdPartyVendors = { [vendor: string]: Partial<TTransportTypeColors> };

const thirdPartyVendorColors: thirdPartyVendors = {
  Ruter: {
    metro: {
      "1": "#0073db",
      "2": "#ec700c",
      "3": "#a85fa5",
      "4": "#004a98",
      "5": "#32aa35",
    },
  },
};

export function getTransportModeColor(
  transportMode: TTransportMode,
  vendor?: string | null,
  line?: string | null,
  presentationColor?: string | null,
  theme?: TTheme
) {
  const themeLookupKey = isThemeContrast(theme) ? "default" : "contrast";

  const presentationColorHex = presentationColor
    ? "#" + presentationColor
    : null;

  // if a non-valid transportMode is provided, a grey color is set as fallback
  const fallbackColor =
    presentationColorHex ?? colors[themeLookupKey][transportMode] ?? "#949494";

  // specific color spec exists for given vendor
  if (vendor && thirdPartyVendorColors[vendor]) {
    const thirdPartyTransportModeColor =
      thirdPartyVendorColors[vendor][transportMode] ?? fallbackColor;

    if (line && typeof thirdPartyTransportModeColor === "object") {
      return thirdPartyTransportModeColor[line] ?? fallbackColor;
    }
    return thirdPartyTransportModeColor;
  }
  // no specific color was found, return fallback
  return fallbackColor;
}

export function isThemeContrast(theme?: TTheme) {
  switch (theme) {
    case "dark":
      return true;
    default:
      return true;
  }
}
