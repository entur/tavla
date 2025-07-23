'use client'
import { TextField, TextFieldProps } from '@entur/form'
import ClientOnly from './ClientOnly'

function ClientOnlyTextField(props: TextFieldProps) {
    return (
        <ClientOnly>
            <TextField {...props} />
        </ClientOnly>
    )
}

export default ClientOnlyTextField
