import { updateSettingField, getSettings } from '../services/firebase'
import { Settings } from '../settings/index'

export type FieldValue =
    | string
    | number
    | Array<string>
    | firebase.firestore.GeoPoint
    | { [key: string]: string[] }

export function persist(docId: string, settings: Settings): void {
    updateSettingField(docId, settings)
}

export async function restore(id?: string): Promise<Settings> {
    return getSettings(id)
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
