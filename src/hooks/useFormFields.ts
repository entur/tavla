import { useState, ChangeEvent } from 'react'

function useFormFields<T>(
    initialState: T,
): [T, (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => void] {
    const [values, setValues] = useState<T>(initialState)

    return [
        values,
        function (
            event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>,
        ): void {
            setValues({
                ...values,
                [event.target.id]: event.target.value,
            })
        },
    ]
}

export { useFormFields }
