'use client'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'

function useLocalStorage<T>(
    key: string,
    initialValue: T,
): [T, Dispatch<SetStateAction<T>>] {
    const [value, setValue] = useState<T>(initialValue)

    useEffect(() => {
        const item = localStorage.getItem(key)
        if (item) setValue(JSON.parse(item))
    }, [key])

    useEffect(() => {
        if (value === initialValue) return
        localStorage.setItem(key, JSON.stringify(value))
    }, [initialValue, key, value])

    return [value, setValue]
}

export { useLocalStorage }
