import { useState, useEffect } from 'react'
import { getDocumentId } from '../utils'
import { useUser } from '../auth'
import { getSettings } from '../services/firebase'

export default function usePermittedTavle(): boolean {
    const [permitted, setPermission] = useState<boolean>(false)
    const documentId = getDocumentId()
    const user = useUser()

    useEffect(() => {
        if (documentId && user) {
            getSettings(documentId).onSnapshot((document) => {
                setPermission(
                    document.exists &&
                        (document.data().owners.includes(user.uid) ||
                            !document.data().owners ||
                            document.data().owners.length < 1),
                )
            })
        }
        setPermission(false)
    }, [documentId, user, setPermission])
    return permitted ? permitted : null
}
