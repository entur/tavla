import { updateSettingField, removeFromArray } from '../services/firebase'

export type FieldTypes =
    | string
    | number
    | string[]
    | firebase.firestore.GeoPoint
    | { [key: string]: string[] }

export function persist(
    docId: string,
    fieldId: string,
    fieldValue: FieldTypes,
): void {
    updateSettingField(docId, fieldId, fieldValue)
}

export function removeOwners(docId: string): void {
    persist(docId, 'owners', [])
}

export function removeFromOwners(docId: string, uid: string): void {
    removeFromArray(docId, 'owners', uid)
}
