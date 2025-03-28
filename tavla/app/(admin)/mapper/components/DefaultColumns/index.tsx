'use client'
import { Heading2, Paragraph } from '@entur/typography'
import React, { useActionState, useState } from 'react'
import { TOrganizationID } from 'types/settings'
import { Columns, TColumn } from 'types/column'
import { useToast } from '@entur/alert'
import { FilterChip } from '@entur/chip'
import { FormError } from 'app/(admin)/components/FormError'
import { TFormFeedback, getFormFeedbackForField } from 'app/(admin)/utils'
import { SubmitButton } from 'components/Form/SubmitButton'
import { saveColumns as saveColumnsAction } from './actions'
import { Tooltip } from '@entur/tooltip'
import { IconButton } from '@entur/button'
import { QuestionFilledIcon } from '@entur/icons'
import { ColumnModal } from './ColumnModal'

function DefaultColumns({
    oid,
    columns,
}: {
    oid?: TOrganizationID
    columns?: TColumn[]
}) {
    const { addToast } = useToast()
    const [open, setIsOpen] = useState(false)

    const saveColumns = async (
        state: TFormFeedback | undefined,
        data: FormData,
    ) => {
        const formFeedback = await saveColumnsAction(state, oid, data)
        if (!formFeedback) {
            addToast('Kolonner lagret!')
        }
        return formFeedback
    }
    const [state, saveColumnsFormAction] = useActionState(
        saveColumns,
        undefined,
    )

    return (
        <div className="box flex flex-col gap-1">
            <div className="flex flex-row items-baseline">
                <Heading2>Kolonner</Heading2>
                <Tooltip
                    aria-hidden
                    placement="top"
                    content="Vis forklaring"
                    id="tooltip-columns-explanation"
                >
                    <IconButton
                        type="button"
                        aria-label="Vis forklaring på kolonner"
                        onClick={() => setIsOpen(true)}
                    >
                        <QuestionFilledIcon size={24} aria-hidden />
                    </IconButton>
                </Tooltip>
            </div>

            <Paragraph margin="none">
                Velg hvilke kolonner som skal være standard når det opprettes en
                ny tavle.
            </Paragraph>

            <ColumnModal isOpen={open} setIsOpen={setIsOpen} />

            <form action={saveColumnsFormAction}>
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
                <div className="mt-4" aria-live="polite">
                    <FormError {...getFormFeedbackForField('column', state)} />
                    <FormError {...getFormFeedbackForField('general', state)} />
                </div>
                <div className="flex flex-row w-full mt-8 justify-end">
                    <SubmitButton
                        variant="secondary"
                        aria-label="Lagre kolonner"
                        className="max-sm:w-full"
                    >
                        Lagre kolonner
                    </SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { DefaultColumns }
