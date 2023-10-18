import { TBoard } from 'types/settings'
import { Badge } from '@entur/layout'
import { colorsFromHash } from '../../utils/colorsFromHash'
import { TagModal } from '../TagModal'
import { useBoardsSettings } from '../../utils/context'
import { sortArrayByOverlap } from '../../utils/sortArrayByOverlap'
import { Tooltip } from '@entur/tooltip'
import { TTag } from 'types/meta'
import { ReactNode } from 'react'
import { DraggableColumn } from './DraggableColumn'

function TagList({ tags, children }: { tags: TTag[]; children?: ReactNode }) {
    return (
        <div className="flexRow flexWrap g-1 alignCenter">
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
            {children}
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

    return (
        <DraggableColumn column="tags">
            <div className="flexRow w-100 g-1">
                <TagModal board={board} />
                <TagList tags={tags.slice(0, displayNumber)}>
                    {hiddenNumber > 0 && (
                        <Tooltip
                            placement="bottom"
                            content={
                                <TagList tags={tags.slice(displayNumber)} />
                            }
                        >
                            <div className="cursorHelp">
                                <Badge variant="neutral">{`+ ${hiddenNumber} til`}</Badge>
                            </div>
                        </Tooltip>
                    )}
                </TagList>
            </div>
        </DraggableColumn>
    )
}

export { Tags }
