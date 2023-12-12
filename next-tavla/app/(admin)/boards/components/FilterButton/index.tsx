'use client'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
} from '@entur/tooltip'
import { IconButton, SecondaryButton } from '@entur/button'
import { Heading2 } from '@entur/typography'
import { CloseIcon, FilterIcon } from '@entur/icons'
import { TTag } from 'types/meta'
import { FilterChip } from '@entur/chip'
import { uniq } from 'lodash'
import classes from './styles.module.css'
import { NotificationBadge } from '@entur/layout'
import { TBoard } from 'types/settings'
import { useParamsSetter } from 'app/(admin)/boards/hooks/useParamsSetter'
import { useBoardsSettings } from '../../hooks/useBoardsSettings'

function FilterButton({ boards }: { boards: TBoard[] }) {
    const { updateQuery } = useParamsSetter()
    const allTags = uniq(
        boards.flatMap((board) => {
            return board?.meta?.tags ?? []
        }),
    )

    const filterTags: TTag[] = useBoardsSettings().filterTags.filter(
        (tag: TTag) => allTags.includes(tag),
    )

    return (
        <Popover>
            <PopoverTrigger>
                <div className={classes.buttonWrapper}>
                    <SecondaryButton aria-label="Filtrer tavler på merkelapper">
                        Filter
                        <FilterIcon aria-hidden="true" />
                    </SecondaryButton>
                    <NotificationBadge variant="primary" max={10}>
                        {filterTags?.length}
                    </NotificationBadge>
                    <span className="visuallyHidden">merkelapper valgt</span>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-1">
                    <div className="flexRow justifyBetween">
                        <Heading2 className="m-1 text-rem-3">
                            Filtrer på merkelapper
                        </Heading2>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <div className={classes.tagsFilterPopover}>
                        {allTags.sort().map((tag: TTag) => (
                            <FilterChip
                                key={tag}
                                checked={filterTags.includes(tag)}
                                onChange={() => updateQuery('filter', tag)}
                                value={tag}
                            >
                                {tag}
                            </FilterChip>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { FilterButton }
