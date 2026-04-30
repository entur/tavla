'use client'
import { type Dispatch, type SetStateAction, useEffect, useState } from 'react'

function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>, boolean] {
    const [value, setValue] = useState<T>(initialValue)
    const [loaded, setLoaded] = useState(false)

    useEffect(() => {
        const item = localStorage.getItem(key)
        if (item) setValue(JSON.parse(item))
        setLoaded(true)
    }, [key])

    useEffect(() => {
        if (value === initialValue) return
        localStorage.setItem(key, JSON.stringify(value))
    }, [initialValue, key, value])

    return [value, setValue, loaded]
}

export { useLocalStorage }
