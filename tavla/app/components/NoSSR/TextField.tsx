'use client'
import React from 'react'
import { TextField, TextFieldProps } from '@entur/form'
import ClientOnlyComponent from './ClientOnlyComponent'

function ClientOnlyTextField(props: TextFieldProps) {
    return (
        <ClientOnlyComponent>
            <TextField {...props} />
        </ClientOnlyComponent>
    )
}

export default ClientOnlyTextField
