'use client'
import { difference } from 'lodash'
import { ActionChip } from '@entur/chip'
import { AddIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TBoard, TBoardID } from 'types/settings'
import { useFormState, useFormStatus } from 'react-dom'
import { useTags } from '../../utils/context'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
import { TTag } from 'types/meta'
import { addTag } from './actions'

function AddExistingTag({ board }: { board: TBoard }) {
    const allTags = useTags()
    const existingTags = difference(allTags, board.meta?.tags ?? [])
    const [state, action] = useFormState(addTag, undefined)

    return (
        <div className="flex flex-col gap-1">
            <Heading3>Legg til eksisterende merkelapp</Heading3>
            <FormError {...getFormFeedbackForField('general', state)} />
            <div className="flex flex-row flex-wrap gap-1" role="listbox">
                {existingTags.map((tag) => (
                    <form action={action} key={tag}>
                        <TagChip bid={board.id ?? ''} tag={tag} />
                    </form>
                ))}
            </div>
        </div>
    )
}

function TagChip({ bid, tag }: { bid: TBoardID; tag: TTag }) {
    const { pending } = useFormStatus()

    return (
        <>
            <HiddenInput id="bid" value={bid} />
            <ActionChip
                name="tag"
                value={tag}
                type="submit"
                loading={pending}
                disabled={pending}
                aria-label={`Legg til eksisterende merkelapp ${tag}`}
            >
                {tag} <AddIcon />
            </ActionChip>
        </>
    )
}

export { AddExistingTag }
