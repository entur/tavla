export type StopPlaceData = {
  name: string;
  estimatedCalls: Departure[];
};

export type Departure = {
  destinationDisplay: {
    frontText: string;
  };
  expectedDepartureTime: string;
  serviceJourney: {
    id: string,
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
};
