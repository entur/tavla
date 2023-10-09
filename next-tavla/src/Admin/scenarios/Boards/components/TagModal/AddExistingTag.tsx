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
        <>
            <Heading3>Legg til eksisterende merkelapp</Heading3>
            <div className="flexWrap g-1">
                {suggestedTags.map((tag) => (
                    <ActionChip
                        key={tag}
                        onClick={() => addTag(tag)}
                        aria-label="Legg til merkelapp"
                    >
                        {tag} <AddIcon />
                    </ActionChip>
                ))}
            </div>
        </>
    )
}

export { AddExistingTag }
