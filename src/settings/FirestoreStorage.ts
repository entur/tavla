import { Settings } from './index'
import firebase from 'firebase/app'

import {
    updateSingleSettingsField,
    removeFromArray,
    deleteDocument,
    updateMultipleSettingsFields,
} from '../services/firebase'

export type FieldTypes =
    | string
    | boolean
    | number
    | string[]
    | firebase.firestore.GeoPoint
    | { [key: string]: string[] }
    | null

export function persistSingleField(
    docId: string,
    fieldId: string,
    fieldValue: FieldTypes,
): void {
    updateSingleSettingsField(docId, fieldId, fieldValue)
}

export function persistMultipleFields(docId: string, settings: Settings): void {
    updateMultipleSettingsFields(docId, settings)
}

export function removeOwners(docId: string): void {
    persistSingleField(docId, 'owners', [])
}

export function removeFromOwners(docId: string, uid: string): void {
    removeFromArray(docId, 'owners', uid)
}

export function deleteTavle(docId: string): void {
    deleteDocument(docId)
}
