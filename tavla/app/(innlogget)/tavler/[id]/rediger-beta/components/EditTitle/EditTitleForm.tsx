'use client'
import { ButtonGroup, SecondaryButton } from '@entur/button'
import { TextField } from '@entur/form'
import { SubmitButton } from 'app/_components/Form/SubmitButton'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useActionState } from 'react'
import { type FormState, saveBoardTitle } from './actions'
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

    async function handleSave(_prevState: FormState, formData: FormData) {
        const result = await saveBoardTitle(bid, _prevState, formData)

        if (result?.status === 'success') {
            capture('board_name_saved', { location: 'board_page' })
            onSuccess()
        }

        return result
    }

    const [state, formAction, isPending] = useActionState(handleSave, null)

    const error = state?.status === 'error' ? state.message : undefined

    return (
        <form action={formAction} className="mt-8 flex flex-col">
            <TextField
                label="Navn på tavla"
                name="title"
                defaultValue={currentTitle}
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
                    onClick={onCancel}
                    className="!m-0"
                    disabled={isPending}
                >
                    Avbryt
                </SecondaryButton>
                <SubmitButton
                    variant="primary"
                    width="fluid"
                    disabled={isPending}
                    className="!m-0"
                >
                    Bekreft valg
                </SubmitButton>
            </ButtonGroup>
        </form>
    )
}
