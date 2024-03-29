import { doc, getDoc, setDoc } from 'firebase/firestore'
import { db } from 'settings/firebase-init'
import { TSettings } from 'lite/types/settings'

async function getFirebaseSettings(documentId: string) {
    return getDoc(doc(db, 'settings-v2', documentId)).then(
        (document) => document.data() as TSettings | undefined,
    )
}

async function setFirebaseSettings(documentId: string, settings: TSettings) {
    return setDoc(doc(db, 'settings-v2', documentId), settings)
}

export { getFirebaseSettings, setFirebaseSettings }
