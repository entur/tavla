import { GeoPoint, getDoc } from 'firebase/firestore'

import {
    updateSingleSettingsField,
    removeFromArray,
    deleteDocument,
    updateMultipleSettingsFields,
    addToArray,
    getSettingsReference,
} from '../services/firebase'
import { OwnerRequest } from '../types'

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

// export function addToOwners(docId: string, uid: string): void {
//     addToArray(docId, 'owners', uid)
// }

// export function acceptOwnerRequestForBoard(
//     docId: string,
//     // uid: string,
//     // ownerRequests: OwnerRequest[],
// ): void {
//     getDoc(getSettingsReference(docId)).then((doc) => console.log(doc.))

//     // removeFromArray(docId, 'ownerRequestRecipients', uid)
//     // updateMultipleSettingsFields(docId, {
//     //     ownerRequests: ownerRequests.filter((req) => req.recipientUID !== uid),
//     // })
//     // updateMultipleSettingsFields(docId, getSettings(docId))
// }

export function deleteTavle(docId: string): void {
    deleteDocument(docId)
}
