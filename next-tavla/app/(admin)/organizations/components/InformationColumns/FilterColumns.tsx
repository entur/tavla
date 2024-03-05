'use client'
import { useToast } from '@entur/alert'
import { FilterChip } from '@entur/chip'
import { SubmitButton } from 'components/Form/SubmitButton'
import React from 'react'
import { Columns, TColumn } from 'types/column'
import { TOrganizationID } from 'types/settings'
import { saveColumns } from './actions'
import {
    TFormFeedback,
    getFormFeedbackForError,
    getFormFeedbackForField,
} from 'app/(admin)/utils'
import { useFormState } from 'react-dom'
import { FormError } from 'app/(admin)/components/FormError'

function FilterColumns({
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

        if (!oid) return

        if (columns.length === 0) {
            return getFormFeedbackForError('organization/invalid-columns')
        }

        saveColumns(oid, columns)
        addToast('Lagret kolonner!')
    }

    const [state, action] = useFormState(submit, undefined)

    return (
        <div>
            <form action={action}>
                <div className="flexRow flexWrap g-2">
                    {Object.entries(Columns).map(([key, information]) => (
                        <FilterChip
                            key={key}
                            value={key}
                            defaultChecked={
                                (columns && columns.includes(key as TColumn)) ??
                                false
                            }
                            name="columns"
                        >
                            {information}
                        </FilterChip>
                    ))}
                </div>
                <div className="mt-4" aria-live="polite">
                    <FormError {...getFormFeedbackForField('general', state)} />
                </div>
                <div className="flexRow w-100 mt-4 mr-2 justifyEnd">
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

export default FilterColumns
