import { useCallback, useEffect, useState } from 'react'

type LocationPermission = {
    granted: boolean
    prompt: boolean
    denied: boolean
}

export function useLocationPermission(): [LocationPermission, () => void] {
    const [someNumber, setSomeNumber] = useState(0)

    const forceUpdate = useCallback((): void => {
        setSomeNumber(someNumber + 1)
    }, [someNumber])

    const [permission, setPermission] = useState<PermissionState | void>()

    useEffect((): void => {
        if (!navigator || !navigator.permissions) return
        navigator.permissions
            .query({ name: 'geolocation' })
            .then((perm) => setPermission(perm.state))
    }, [someNumber])

    return [
        {
            granted: permission === 'granted',
            prompt: permission === 'prompt',
            denied: permission === 'denied',
        },
        forceUpdate,
    ]
}
