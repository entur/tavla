export function getFromLocalStorage<T>(key: string): T | undefined {
    let ls
    if (window.localStorage) {
        try {
            const savedValue = window.localStorage.getItem(key)
            if (!savedValue) return undefined
            ls = JSON.parse(savedValue)
        } catch (e) {
            // eslint-disable-next-line no-console
            console.log(e)
        }
    }
    return ls
}

export function saveToLocalStorage<T>(key: string, value: T): void {
    if (!window.localStorage) return
    window.localStorage.setItem(key, JSON.stringify(value))
}
