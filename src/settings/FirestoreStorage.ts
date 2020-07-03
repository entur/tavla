import { updateSettingField } from '../services/firebase'

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

export function changePath(): void {
    const urlParts = window.location.pathname.split('/')
    const newPathname = urlParts.join('/')
    switch (urlParts[0]) {
        case 'admin':
            urlParts.shift()
            window.history.pushState(
                window.history.state,
                document.title,
                newPathname,
            )
            break
        default:
            window.history.pushState(
                window.history.state,
                document.title,
                window.location.pathname,
            )
    }
}
