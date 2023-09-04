import { TagChip } from '@entur/chip'

function Tag({
    tag,
    deleteHandler,
}: {
    tag: string
    deleteHandler: () => void
}) {
    return (
        <TagChip aria-label={tag} onClose={deleteHandler}>
            {tag}
        </TagChip>
    )
}

export { Tag }
