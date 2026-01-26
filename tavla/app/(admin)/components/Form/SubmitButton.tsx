'use client'
import { Button, ButtonProps } from '@entur/button'
import { useFormStatus } from 'react-dom'

function SubmitButton(props: ButtonProps<typeof Button>) {
    const { pending } = useFormStatus()
    return (
        <Button {...props} type="submit" loading={pending} disabled={pending} />
    )
}

export { SubmitButton }
