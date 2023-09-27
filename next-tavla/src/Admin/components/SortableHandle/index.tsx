import { useSortable } from '@dnd-kit/sortable'
import { IconProps } from '@entur/icons'
import classes from './styles.module.css'

function SortableHandle({
    id,
    ariaLabel,
    Icon,
}: {
    id: string
    ariaLabel?: string
    Icon: React.FC<IconProps>
}) {
    const { attributes, listeners } = useSortable({ id: id })

    return (
        <Icon
            className={classes.sortableIcon}
            {...attributes}
            {...listeners}
            data-cy="sortable-handle"
            aria-label={ariaLabel}
            size={16}
        />
    )
}

export { SortableHandle }
