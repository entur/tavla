export function uniqueArrayItems<T>(array: T[]) {
    return array.filter((item, index) => array.indexOf(item) === index)
}
