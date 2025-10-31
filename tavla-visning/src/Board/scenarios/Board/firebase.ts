"use client";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  connectFirestoreEmulator,
} from "firebase/firestore";
import type { BoardDB, BoardId } from "../../../Shared/types/db-types/boards";
import { makeBoardCompatible } from "./compatibility";
import type {
  FolderDB,
  FolderId,
} from "../../../Shared/types/db-types/folders";
import { initializeApp } from "firebase/app";

const app = initializeApp({
  projectId: "ent-tavla-dev",
});

const db = getFirestore(app);

connectFirestoreEmulator(db, "localhost", 8080);

export async function getBoard(bid: BoardId) {
  try {
    const ref = doc(db, "boards", bid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return undefined;

    return makeBoardCompatible({
      id: snap.id,
      ...snap.data(),
    } as BoardDB);
  } catch (error) {
    throw error;
  }
}

export async function getFolder(folderid: FolderId) {
  try {
    const ref = doc(db, "folders", folderid);
    const snap = await getDoc(ref);
    if (!snap.exists()) return undefined;

    return {
      id: snap.id,
      ...snap.data(),
    } as FolderDB;
  } catch (error) {
    throw error;
  }
}

export async function getFolderForBoard(bid: BoardId) {
  try {
    const q = query(
      collection(db, "folders"),
      where("boards", "array-contains", bid)
    );
    const ref = await getDocs(q);

    const folder = ref.docs.map(
      (doc) => ({ id: doc.id, ...doc.data() } as FolderDB)
    );
    return folder[0] ?? null;
  } catch (error) {
    throw error;
  }
}
