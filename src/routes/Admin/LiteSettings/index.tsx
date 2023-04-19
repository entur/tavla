import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, setDoc } from 'firebase/firestore' // Replace with Lite maybe
import { db } from 'src/settings/firebase-init'
import { Theme } from 'src/types'
import { TSettings } from './types/settings'

async function getFirebaseSettings(documentId: string) {
    return getDoc(doc(db, 'settings-v2', documentId)).then(
        (document) => document.data() as TSettings | undefined,
    )
}

async function setFirebaseSettings(documentId: string, settings: TSettings) {
    return setDoc(doc(db, 'settings-v2', documentId), settings)
}

function LiteSettingsLoader() {
    const { documentId } = useParams<{ documentId: string }>()
    const [settings, setSettings] = useState<TSettings | undefined | null>(null)

    useEffect(() => {
        if (!documentId) return

        getFirebaseSettings(documentId).then(setSettings)
    }, [documentId])

    if (!documentId)
        return <div>Noe har gått galt, hvordan kom du deg hit?</div>

    if (settings === null) return <div>Loading</div>

    if (settings === undefined)
        return (
            <div>
                Vi fant ikke denne Lite-Tavla. Vil du opprette den?
                <br />
                <button
                    onClick={() => {
                        const defaultSettings: TSettings = { tiles: [] }
                        setSettings(defaultSettings)
                        setFirebaseSettings(documentId, defaultSettings)
                    }}
                >
                    Opprett lite-tavle
                </button>
            </div>
        )

    return <LiteSettings initialSettings={settings} documentId={documentId} />
}

const themes: Record<Theme, string> = {
    default: 'Entur',
    dark: 'Mørk',
    light: 'Lyst',
    grey: 'Grå',
}

function LiteSettings({
    initialSettings,
    documentId,
}: {
    initialSettings: TSettings
    documentId: string
}) {
    const [data, setData] = useState<TSettings>(initialSettings)

    return (
        <div>
            {JSON.stringify(data)}
            <br />
            <select
                value={data?.theme}
                onChange={(e) =>
                    setData((old) => ({
                        ...old,
                        theme: e.target.value as Theme,
                    }))
                }
            >
                {Object.entries(themes).map(([key, value]) => (
                    <option key={key} value={key}>
                        {value}
                    </option>
                ))}
            </select>
            <br />
            <button
                onClick={() => {
                    setFirebaseSettings(documentId, data)
                }}
            >
                Save
            </button>
        </div>
    )
}

export { LiteSettingsLoader as LiteSettings }
