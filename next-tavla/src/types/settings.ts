import { TTile } from "./tile";

export type TTheme = "default" | "dark";

export type TSettings = {
  tiles: TTile[];
  theme?: TTheme;
};
