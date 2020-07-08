import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/storage'
import { firestore } from 'firebase'
import { v4 as uuidv4 } from 'uuid'

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

export const uploadLogo = async (image: File): Promise<string> => {
    const uploadTask = firebase
        .storage()
        .ref()
        .child(`images/${uuidv4()}/${image.name}`)
        .put(image)

    return new Promise((resolve, reject) => {
        uploadTask.on(
            firebase.storage.TaskEvent.STATE_CHANGED,
            null,
            reject,
            async () => {
                resolve(await uploadTask.snapshot.ref.getDownloadURL())
            },
        )
    })
}
