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
    fieldId: string,
    fieldValue:
        | string
        | number
        | Array<string>
        | firebase.firestore.GeoPoint
        | { [key: string]: string[] },
): Promise<void> => {
    return firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(id)
        .update({ [fieldId]: fieldValue })
}

export const createSettings = async (
    settings: Settings,
): Promise<DocumentReference> => {
    return firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .add(settings)
}
