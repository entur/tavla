import { TTile } from "./tile";

type TTheme = "default" | "dark"

export type TSettings = {
  tiles: TTile[];
  theme?: TTheme
};
