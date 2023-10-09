import classes from './styles.module.css'
import { TBoard } from 'types/settings'
import { SortableColumn } from './SortableColumn'
import { Badge } from '@entur/layout'
import { colorsFromHash } from '../../utils/colorsFromHash'
import { TagModal } from '../TagModal'

function Tags({ board }: { board: TBoard }) {
    const tags = board.meta?.tags ?? []

    return (
        <SortableColumn column="tags">
            <div className={classes.tags}>
                <TagModal board={board} />
                {tags.sort().map((tag) => (
                    <Badge
                        key={tag}
                        aria-label={tag}
                        variant="primary"
                        style={{
                            color: 'white',
                            backgroundColor: colorsFromHash(tag),
                        }}
                    >
                        {tag}
                    </Badge>
                ))}
            </div>
        </SortableColumn>
    )
}

export { Tags }
