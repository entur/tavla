export function getFromLocalStorage<T>(key: string): T | undefined {
    let ls
    if (window.localStorage) {
        try {
            ls = JSON.parse(window.localStorage.getItem(key))
        } catch (e) {
            console.log(e)
        }
    }
    return ls
}

export function saveToLocalStorage<T>(key: string, value: T): void {
    if (!window.localStorage) return
    window.localStorage.setItem(key, JSON.stringify(value))
}
