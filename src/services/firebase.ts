import firebase from 'firebase/app'
import 'firebase/firestore'
import { firestore } from 'firebase'

import { Settings } from '../settings/index'

const SETTINGS_COLLECTION = 'settings'
type DocumentReference = firestore.DocumentReference

export const getSettings = async (
    id: string,
): Promise<Settings | undefined> => {
    const document = await firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(id)
        .get()
    return document.data() as Settings | undefined
}

export const updateSettingField = async (
    id: string,
    settings: Settings,
): Promise<void> => {
    return firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(id)
        .update(settings)
}

export const createSettings = async (
    settings: Settings,
): Promise<DocumentReference> => {
    return firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .add(settings)
}
