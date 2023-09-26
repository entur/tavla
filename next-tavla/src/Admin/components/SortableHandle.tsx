import { useSortable } from '@dnd-kit/sortable'
import { UnsortedIcon } from '@entur/icons'
import { TavlaButton } from './Button'

function SortableHandle({
    id,
    ariaLabel,
    icon,
}: {
    id: string
    ariaLabel?: string
    icon?: React.ReactNode
}) {
    const { attributes, listeners } = useSortable({ id: id })

    return (
        <TavlaButton
            {...attributes}
            {...listeners}
            data-cy="sortable-handle"
            aria-label={ariaLabel}
        >
            {icon ?? <UnsortedIcon size={16} />}
        </TavlaButton>
    )
}

export { SortableHandle }
