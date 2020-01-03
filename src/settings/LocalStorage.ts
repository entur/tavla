export function getFromLocalStorage(key): object {
    let ls = {}
    if (window.localStorage) {
        try {
            ls = JSON.parse(window.localStorage.getItem(key)) || {}
        }
        catch (e) {
            console.log(e)
        }
    }
    return ls
}

export function saveToLocalStorage(key, value): void {
    if (!window.localStorage) return
    window.localStorage.setItem(key, JSON.stringify(value))
}
