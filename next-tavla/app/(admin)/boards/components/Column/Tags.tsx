'use client'
import { TBoard } from 'types/settings'
import { Badge } from '@entur/layout'
import { TagModal } from '../TagModal'
import { Tooltip } from '@entur/tooltip'
import { TTag } from 'types/meta'
import { ReactNode } from 'react'
import { Column } from './Column'
import { colorsFromHash, sortArrayByOverlap } from '../../utils'
import { TagsContext } from '../../utils/context'
import { useSearchParam } from '../../hooks/useSearchParam'

function TagList({ tags, children }: { tags: TTag[]; children?: ReactNode }) {
    return (
        <div className="flexRow flexWrap g-1 alignCenter" role="list">
            {tags.map((tag) => (
                <Badge
                    role="listitem"
                    key={tag}
                    variant="primary"
                    style={{
                        color: 'white',
                        backgroundColor: colorsFromHash(tag),
                    }}
                >
                    <span className="visuallyHidden">Merkelapp:</span>
                    {tag}
                </Badge>
            ))}
            {children}
        </div>
    )
}

function Tags({
    board,
    allTags,
    displayNumber = 3,
}: {
    board: TBoard
    allTags: TTag[]
    displayNumber?: number
}) {
    let tags = (board.meta?.tags ?? []).sort()
    const value = useSearchParam('filter')
    const filterTags = value?.split(',') ?? []
    const hiddenNumber = tags.length - displayNumber

    if (filterTags.length) {
        tags = sortArrayByOverlap(tags, filterTags)
    }

    return (
        <TagsContext.Provider value={allTags ?? []}>
            <Column column="tags">
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
                                    <Badge variant="neutral">
                                        + {hiddenNumber} til
                                    </Badge>
                                </div>
                            </Tooltip>
                        )}
                    </TagList>
                </div>
            </Column>
        </TagsContext.Provider>
    )
}

export { Tags }
