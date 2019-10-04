import { useState, useEffect } from 'react'

// Permission can be "unknown" | "defer" | "allow" | "deny"
export function useLocationPermission() {
    const [someNumber, setSomeNumber] = useState(0)

    const forceUpdate = () => {
        setSomeNumber(someNumber + 1)
    }

    const [permission, setPermission] = useState({
        granted: false,
        prompt: false,
        denied: false,
    })

    useEffect(() => {
        if (!navigator || !navigator.permissions) return Promise.resolve(false)
        navigator.permissions.query({ name: 'geolocation' })
            .then(perm => setPermission(perm.state))
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
