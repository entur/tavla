import { GeoPoint } from 'firebase/firestore'

import {
    updateSingleSettingsField,
    removeFromArray,
    deleteDocument,
    updateMultipleSettingsFields,
} from '../services/firebase'

import { Settings } from './index'

export type FieldTypes =
    | string
    | boolean
    | number
    | string[]
    | GeoPoint
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
