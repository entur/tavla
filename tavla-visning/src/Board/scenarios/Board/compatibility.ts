// TODO: remove 15. december when new lines are active
// Remember to do a migration script in Firestore beforehand

import type {
  BoardDB,
  BoardTileDB,
} from "../../../Shared/types/db-types/boards";

export function makeBoardCompatible(board: BoardDB): BoardDB {
  const updatedTiles: BoardTileDB[] = board.tiles.map(
    ({ whitelistedLines, ...tile }) => ({
      ...tile,
      ...(whitelistedLines && {
        whitelistedLines: whitelistedLines.flatMap(oldLineIdsToNew),
      }),
    })
  );
  return { ...board, tiles: updatedTiles };
}

function oldLineIdsToNew(lineId: string): string | string[] {
  switch (lineId) {
    case "VYG:Line:41":
      return "VYG:Line:F4";
    case "VYG:Line:45":
      return "VYG:Line:R40";
    case "VYG:Line:43":
      return "VYG:Line:L4";
    case "FLB:Line:42":
      return "VYG:Line:R45";
    case "VYG:Line:70":
      return "VYG:Line:F1";
    case "NSB:Line:R20":
      return "VYG:Line:RE20";
    case "NSB:Line:RX20":
      return "VYG:Line:RX20";
    case "NSB:Line:L21":
      return "VYG:Line:R21";
    case "NSB:Line:L22":
      return "VYG:Line:R22";
    case "NSB:Line:R23":
      return "VYG:Line:R23";
    case "NSB:Line:R23x":
      return "VYG:Line:R23x";
    case "NSB:Line:L2":
      return "VYG:Line:L2";
    case "NSB:Line:L2x":
      return "VYG:Line:L2x";
    case "GJB:Line:R30":
      return "VYG:Line:RE30";
    case "GJB:Line:L3":
      return "VYG:Line:R31";
    case "NSB:Line:R10":
      return "VYG:Line:RE10";
    case "NSB:Line:R11":
      return "VYG:Line:RE11";
    case "NSB:Line:RX11":
      return "VYG:Line:RX11";
    case "NSB:Line:L12":
      return "VYG:Line:R12";
    case "NSB:Line:L13":
      return "VYG:Line:R13";
    case "NSB:Line:R13x":
      return "VYG:Line:R13x";
    case "NSB:Line:L14":
      return "VYG:Line:R14";
    case "NSB:Line:52":
      return "VYG:Line:R55";
    case "NSB:Line:L1":
      return "VYG:Line:L1";

    default:
      return lineId;
  }
}

export const OLD_LINE_IDS = [
  "VYG:Line:41",
  "VYG:Line:45",
  "VYG:Line:43",
  "FLB:Line:42",
  "VYG:Line:70",
  "NSB:Line:R20",
  "NSB:Line:RX20",
  "NSB:Line:L21",
  "NSB:Line:L22",
  "NSB:Line:R23",
  "NSB:Line:R23x",
  "NSB:Line:L2",
  "NSB:Line:L2x",
  "GJB:Line:R30",
  "GJB:Line:L3",
  "NSB:Line:R10",
  "NSB:Line:R11",
  "NSB:Line:RX11",
  "NSB:Line:L12",
  "NSB:Line:L13",
  "NSB:Line:R13x",
  "NSB:Line:L14",
  "NSB:Line:52",
  "NSB:Line:L1",
];
