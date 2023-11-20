import { TTag } from 'types/meta'
import { useBoardsSettings } from '../../utils/context'
import { difference, uniq } from 'lodash'
import { ActionChip } from '@entur/chip'
import { AddIcon } from '@entur/icons'
import { Heading3 } from '@entur/typography'

function AddExistingTag({
    addTag,
    boardTags,
}: {
    addTag: (tag: TTag) => void
    boardTags: TTag[]
}) {
    const { boards } = useBoardsSettings()

    const allTags = uniq(
        boards.flatMap((board) => {
            return board?.meta?.tags ?? []
        }),
    )

    const suggestedTags = difference(allTags, boardTags)

    return (
        <div className="flexColumn g-1">
            <Heading3>Legg til eksisterende merkelapp</Heading3>
            <div className="flexRow flexWrap g-1" role="listbox">
                {suggestedTags.map((tag) => (
                    <ActionChip
                        key={tag}
                        onClick={() => addTag(tag)}
                        aria-label={`Legg til eksisterende merkelapp ${tag}`}
                    >
                        {tag} <AddIcon />
                    </ActionChip>
                ))}
            </div>
        </div>
    )
}

export { AddExistingTag }
