import classes from './styles.module.css'
import { TBoard } from 'types/settings'
import { SortableColumn } from './SortableColumn'
import { Badge } from '@entur/layout'
import { colorsFromHash } from '../../utils/colorsFromHash'
import { TagModal } from '../TagModal'
import { useBoardsSettings } from '../../utils/context'
import { sortArrayByOverlap } from '../../utils/sortArrayByOverlap'

function Tags({ board }: { board: TBoard }) {
    let tags = (board.meta?.tags ?? []).sort()
    const { filterTags } = useBoardsSettings()

    const displayNumber = 3
    const hiddenNumber = tags.length - displayNumber

    if (filterTags.length) {
        tags = sortArrayByOverlap(tags, filterTags)
    }

    return (
        <SortableColumn column="tags">
            <div className={classes.tags}>
                <TagModal board={board} />
                {tags.slice(0, displayNumber).map((tag) => (
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
                {hiddenNumber && (
                    <Badge variant="neutral">{`+ ${hiddenNumber} til`}</Badge>
                )}
            </div>
        </SortableColumn>
    )
}

export { Tags }
