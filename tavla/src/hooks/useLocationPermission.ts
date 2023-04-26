import { useEffect, useState } from 'react'

export function useLocationPermission() {
    const [permission, setPermission] = useState<PermissionState | undefined>()

    function onPermissionUpdate(ev: Event) {
        setPermission((ev.currentTarget as PermissionStatus).state)
    }

    useEffect(() => {
        navigator.permissions.query({ name: 'geolocation' }).then((status) => {
            setPermission(status.state)
            status.addEventListener('change', onPermissionUpdate)
        })

        return () => {
            navigator.permissions
                .query({ name: 'geolocation' })
                .then((status) => {
                    status.removeEventListener('change', onPermissionUpdate)
                })
        }
    }, [])

    return permission
}
