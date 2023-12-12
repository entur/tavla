'use client'
import { difference } from 'lodash'
import { ActionChip } from '@entur/chip'
import { AddIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'
import { addTagAction } from '../../utils/formActions'
import { HiddenInput } from 'components/Form/HiddenInput'
import { TBoard } from 'types/settings'
import { useFormState } from 'react-dom'
import { useTags } from '../../utils/context'
import { FormError } from 'app/(admin)/components/FormError'
import { getFormFeedbackForField } from 'app/(admin)/utils'
function AddExistingTag({ board }: { board: TBoard }) {
    const allTags = useTags()
    const existingTags = difference(allTags, board.meta?.tags ?? [])
    const [state, action] = useFormState(addTagAction, undefined)

    return (
        <div className="flexColumn g-1">
            <Heading3>Legg til eksisterende merkelapp</Heading3>
            <div className="flexRow flexWrap g-1" role="listbox">
                {existingTags.map((tag) => (
                    <form action={action} key={tag}>
                        <HiddenInput id="bid" value={board.id} />
                        <FormError
                            {...getFormFeedbackForField('general', state)}
                        />
                        <ActionChip
                            key={tag}
                            name="tag"
                            value={tag}
                            type="submit"
                            aria-label={`Legg til eksisterende merkelapp ${tag}`}
                        >
                            {tag} <AddIcon />
                        </ActionChip>
                    </form>
                ))}
            </div>
        </div>
    )
}

export { AddExistingTag }
