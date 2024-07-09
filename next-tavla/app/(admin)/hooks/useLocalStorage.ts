import { useEffect, useState } from 'react'

export const useLocalStorage = <T>(key: string, defaultValue: T) => {
    const [localStorageValue, setLocalStorageValue] = useState(() => {
        try {
            const value = localStorage.getItem(key)

            if (value) {
                return JSON.parse(value)
            } else {
                localStorage.setItem(key, JSON.stringify(defaultValue))
                return defaultValue
            }
        } catch (error) {
            localStorage.setItem(key, JSON.stringify(defaultValue))
            return defaultValue
        }
    })

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(localStorageValue))
    }, [key, localStorageValue])

    return [localStorageValue, setLocalStorageValue]
}

export default useLocalStorage
