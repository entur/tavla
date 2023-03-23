export type StopPlaceData = {
  name: string;
  estimatedCalls: Array<{
    destinationDisplay: {
      frontText: string;
    };
    expectedDepartureTime: string;
    serviceJourney: {
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
  }>;
};
