import type { GeoPoint } from 'firebase/firestore'
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

export const removeFromOwners = async (
    docId: string,
    uid: string,
): Promise<void> => {
    await removeFromArray(docId, 'owners', uid)
}

export function deleteTavle(docId: string): void {
    deleteDocument(docId)
}
