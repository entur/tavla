import firebase from 'firebase/app'
import 'firebase/firestore'
import { firestore } from 'firebase'

import { Settings } from '../settings/index'

const SETTINGS_COLLECTION = 'settings'
type DocumentReference = firestore.DocumentReference

export const getSettings = (id: string): DocumentReference => {
    return firebase.firestore().collection(SETTINGS_COLLECTION).doc(id)
}

export const updateSettingField = async (
    docId: string,
    fieldId: string,
    fieldValue:
        | string
        | number
        | string[]
        | firebase.firestore.GeoPoint
        | { [key: string]: string[] },
): Promise<void> => {
    return firebase
        .firestore()
        .collection(SETTINGS_COLLECTION)
        .doc(docId)
        .update({ [fieldId]: fieldValue })
}

export const createSettings = async (
    settings: Settings,
): Promise<DocumentReference> => {
    return firebase.firestore().collection(SETTINGS_COLLECTION).add(settings)
}
