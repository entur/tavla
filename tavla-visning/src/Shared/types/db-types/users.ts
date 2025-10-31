import type { BoardId } from "./boards";

export type UserDB = {
  uid?: UserId;
  owner?: BoardId[];
};

export type UserId = string;
