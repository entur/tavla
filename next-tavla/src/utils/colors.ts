import { type transportMode } from "~/types/transport";

type transportLineColors = { [line: string]: string };

type transportTypeColor = string | transportLineColors;

type transportTypeColors = {
  [tm in transportMode]: transportTypeColor;
};

export const defaultColors: transportTypeColors = {
  metro: "#f08901",
  bus: "#ff6392",
  plane: "#fbafea",
  helicopter: "#e258c3",
  tram: "#b482fb",
  funicular: "#a476e5",
  cableway: "#a476e5",
  taxi: "#ffffff",
  bicycle: "#ffffff",
  walk: "#ffffff",
  rail: "#42a5f5",
  ferry: "#6fdfff",
  carferry: "#6fdfff",
  mobility: "#00db9b",
};

type thirdPartyVendors = { [vendor: string]: Partial<transportTypeColors> };

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
  transportMode: keyof transportTypeColors,
  vendor?: string,
  line?: string,
  presentationColor?: string
) {
  const presentationColorHex = presentationColor
    ? "#" + presentationColor
    : null;
  // if a non-valid transportMode is provided, a grey color is set as fallback
  const fallbackColor =
    presentationColorHex ?? defaultColors[transportMode] ?? "#949494";

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
