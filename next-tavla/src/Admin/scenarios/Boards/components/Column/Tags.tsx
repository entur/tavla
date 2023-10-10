import classes from './styles.module.css'
import { TBoard } from 'types/settings'
import { SortableColumn } from './SortableColumn'
import { Badge } from '@entur/layout'
import { colorsFromHash } from '../../utils/colorsFromHash'
import { TagModal } from '../TagModal'
import { useBoardsSettings } from '../../utils/context'
import { sortArrayByOverlap } from '../../utils/sortArrayByOverlap'
import { Tooltip } from '@entur/tooltip'
import { TTag } from 'types/meta'
import { ReactElement } from 'react'

function TagList({
    tags,
    tagsTooltip,
}: {
    tags: TTag[]
    tagsTooltip?: ReactElement
}) {
    return (
        <div>
            <div className={classes.tags}>
                {tags.map((tag) => (
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
                {tagsTooltip}
            </div>
        </div>
    )
}

function Tags({ board }: { board: TBoard }) {
    let tags = (board.meta?.tags ?? []).sort()
    const { filterTags } = useBoardsSettings()

    const displayNumber = 3
    const hiddenNumber = tags.length - displayNumber

    if (filterTags.length) {
        tags = sortArrayByOverlap(tags, filterTags)
    }

    const hiddenTags = hiddenNumber ? (
        <Tooltip
            placement={'bottom'}
            content={<TagList tags={tags.slice(displayNumber)} />}
        >
            <Badge
                style={{ cursor: 'help' }}
                variant="neutral"
            >{`+ ${hiddenNumber} til`}</Badge>
        </Tooltip>
    ) : (
        <></>
    )
    return (
        <SortableColumn column="tags">
            <TagModal board={board} />
            <div className={classes.tags}>
                {
                    <TagList
                        tags={tags.slice(0, displayNumber)}
                        tagsTooltip={hiddenTags}
                    />
                }
            </div>
        </SortableColumn>
    )
}

export { Tags }
