import { firebase, TSettings } from "@/types/settings";
import { initializeApp } from "firebase/app";
import {
  getDoc,
  addDoc,
  doc,
  collection,
  getFirestore,
} from "@firebase/firestore/lite";
import { firebaseConfig } from "@/assets/firebaseConfig";

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);

export async function getBoardSettings(boardId: string) {
  const document = await getDoc(doc(firestore, "settings-v2", boardId));
  return document.data() as TSettings;
}

export async function setBoardSettings(settings: TSettings) {
  const document = await addDoc(collection(firestore, "settings-v2"), settings);
  console.log(document);
}
