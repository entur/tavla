import firebase from 'firebase/app'
import 'firebase/firestore'
import { DocumentReference } from '@firebase/firestore-types'
import { Coordinates } from '@entur/sdk'

import { Settings } from '../settings/index'

const SETTINGS_COLLECTION = 'Settings'

export const getSettings = async (id: string): Promise<Settings>  => {
    const document = await firebase.firestore().collection(SETTINGS_COLLECTION).doc(id).get()
    return document.data() as Settings
}

export const generateNewTavla = async (position: Coordinates): Promise<DocumentReference> => {
    return firebase.firestore().collection(SETTINGS_COLLECTION).add({
        coordinates: new firebase.firestore.GeoPoint(position.latitude, position.longitude)
    })
}

