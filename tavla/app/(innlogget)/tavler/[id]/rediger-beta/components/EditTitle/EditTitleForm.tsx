'use client'
import { ButtonGroup, SecondaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState, useEffect, useState } from 'react'
import { saveBoardTitle } from './actions'
import { BOARD_TITLE_MAX_LENGTH } from './validation'

export function EditTitleForm({
    bid,
    currentTitle,
    onSuccess,
    onCancel,
}: {
    bid: string
    currentTitle: string
    onSuccess: () => void
    onCancel: () => void
}) {
    const { capture } = usePosthogTracking()
    const [value, setValue] = useState(currentTitle)
    const [state, formAction] = useActionState(
        saveBoardTitle.bind(null, bid),
        null,
    )

    useEffect(() => {
        if (state?.status === 'success') {
            capture('board_name_saved', { location: 'board_page' })
            onSuccess()
        }
    }, [state, capture, onSuccess])

    const error = state?.status === 'error' ? state.message : undefined

    return (
        <form action={formAction} className="mt-6 flex flex-col">
            <TextField
                label="Navn på tavla"
                name="title"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                maxLength={BOARD_TITLE_MAX_LENGTH}
                required
                aria-required
                variant={error ? 'negative' : undefined}
                feedback={error}
            />
            <ButtonGroup className="mt-8 flex flex-row gap-4">
                <SecondaryButton
                    type="button"
                    width="fluid"
                    className="!mr-0"
                    onClick={onCancel}
                >
                    Avbryt
                </SecondaryButton>
                <SubmitButton variant="primary" width="fluid" className="!mr-0">
                    Bekreft valg
                </SubmitButton>
            </ButtonGroup>
        </form>
    )
}
