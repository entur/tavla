import { TTile } from "./tile";

export type TSettings = {
  tiles: TTile[];
};

export const firebase: Record<string, TSettings> = {
  abc: {
    tiles: [
      {
        type: "departure",
        placeId: "NSR:StopPlace:58366",
      },
      {
        type: "departure",
        placeId: "NSR:StopPlace:20123",
      },
    ],
  },
};
