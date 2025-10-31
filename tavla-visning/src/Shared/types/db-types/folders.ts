import type { BoardId } from "../../types/db-types/boards";
import type { UserId } from "../../types/db-types/users";

export type FolderDB = {
  id?: FolderId;
  name?: string;
  owners?: UserId[];
  boards?: BoardId[];
  logo?: FolderLogo;
};

export type FolderLogo = string;
export type FolderId = string;
