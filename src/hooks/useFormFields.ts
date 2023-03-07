import { useState, ChangeEvent } from 'react'

function useFormFields<T>(
    initialState: T,
): [
    T,
    <S extends { value: string; id: string }>(event: ChangeEvent<S>) => void,
] {
    const [values, setValues] = useState<T>(initialState)

    return [
        values,
        function (event) {
            setValues((prev) => ({
                ...prev,
                [event.target.id]: event.target.value,
            }))
        },
    ]
}

export { useFormFields }
