'use client'
import { Heading2, Paragraph } from '@entur/typography'
import React from 'react'
import { TOrganizationID } from 'types/settings'
import { Columns, TColumn } from 'types/column'
import { useToast } from '@entur/alert'
import { FilterChip } from '@entur/chip'
import { FormError } from 'app/(admin)/components/FormError'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { useFormState } from 'react-dom'
import { saveColumns } from './actions'

function DefaultColumns({
    oid,
    columns,
}: {
    oid?: TOrganizationID
    columns?: TColumn[]
}) {
    const { addToast } = useToast()

    const submit = async (
        prevState: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const columns = data.getAll('columns') as TColumn[]

        if (!oid) {
            return getFormFeedbackForError('auth/operation-not-allowed')
        }

        if (columns.length === 0) {
            return getFormFeedbackForError('organization/invalid-columns')
        }

        saveColumns(oid, columns)
        addToast('Kolonner lagret!')
    }

    const [state, action] = useFormState(submit, undefined)

    return (
        <div className="box flex flex-col gap-1">
            <Heading2>Kolonner</Heading2>
            <Paragraph>
                Velg hvilke kolonner som skal være standard når det opprettes en
                ny tavle.
            </Paragraph>

            <form action={action}>
                <div className="flex flex-row flex-wrap gap-4">
                    {Object.entries(Columns).map(([key, information]) => (
                        <FilterChip
                            key={key}
                            value={key}
                            defaultChecked={
                                columns?.includes(key as TColumn) ?? false
                            }
                            name="columns"
                        >
                            {information}
                        </FilterChip>
                    ))}
                </div>
                <div className="mt-8" aria-live="polite">
                    <FormError {...getFormFeedbackForField('column', state)} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                </div>
                <div className="flex flex-row w-full mt-8 mr-8 justify-end">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre kolonner"
                    >
                        Lagre kolonner
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { DefaultColumns }
