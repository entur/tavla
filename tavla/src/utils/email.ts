export function validEmail(string: string) {
    return new RegExp(/^[\w.-]+@([\w-]+\.)+[\w-]{2,4}$/g).test(string)
}
