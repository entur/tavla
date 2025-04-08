'use client'
import { Badge } from '@entur/layout'
import { TTag } from 'types/meta'
import { colorsFromHash } from '../../utils'
import { ColumnWrapper } from './ColumnWrapper'

function Tags({ tags }: { tags: TTag[] }) {
    return (
        <ColumnWrapper column="tags">
            <ul className="flex flex-row flex-wrap gap-1 items-center">
                {tags.map((tag) => {
                    const color = colorsFromHash(tag)
                    return (
                        <li key={tag}>
                            <Badge
                                variant="primary"
                                type="status"
                                style={{
                                    backgroundColor: color,
                                    borderColor: color,
                                }}
                            >
                                <span className="visuallyHidden">
                                    Merkelapp:
                                </span>
                                {tag}
                            </Badge>
                        </li>
                    )
                })}
            </ul>
        </ColumnWrapper>
    )
}

export { Tags }
