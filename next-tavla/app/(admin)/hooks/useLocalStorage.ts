import { useEffect, useState } from 'react'

function useLocalStorage<T>(key: string, defaultValue: T) {
    const [localStorageValue, setLocalStorageValue] = useState(() => {
        try {
            const value = localStorage.getItem(key)
            return value ? JSON.parse(value) : defaultValue
        } catch (error) {
            return defaultValue
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(localStorageValue))
    }, [key, localStorageValue])

    return [localStorageValue, setLocalStorageValue]
}

export default useLocalStorage
