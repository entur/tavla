export type TStopPlaceData = {
  name: string;
  estimatedCalls: TDeparture[];
};

export type TDeparture = {
  destinationDisplay: {
    frontText: string;
  };
  expectedDepartureTime: string;
  serviceJourney: {
    id: string;
    transportMode: string;
    transportSubmode: string;
    line: {
      publicCode: string;
      authority: {
        name: string;
      };
      presentation: {
        textColour?: string;
        colour?: string;
      };
    };
  };
  cancellation: boolean;
  situations: TSituation[];
};

export type TSituation = {
  description: TSituationText[];
  summary: TSituationText[];
  severity: TSituationSeverity;
};

type TSituationText = {
  value: string;
  language: string;
};

type TSituationSeverity =
  | "unknown"
  | "noImpact"
  | "verySlight"
  | "slight"
  | "normal"
  | "severe"
  | "verySevere"
  | "undefined";
