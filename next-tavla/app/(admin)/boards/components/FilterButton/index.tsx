'use client'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
} from '@entur/tooltip'
import { IconButton, SecondaryButton } from '@entur/button'
import { Heading4 } from '@entur/typography'
import { CloseIcon, FilterIcon } from '@entur/icons'
import { TTag } from 'types/meta'
import { FilterChip } from '@entur/chip'
import { uniq, xor } from 'lodash'
import classes from './styles.module.css'
import { NotificationBadge } from '@entur/layout'
import { TBoard } from 'types/settings'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'

function FilterButton({ boards }: { boards: TBoard[] }) {
    const [value, replace] = useSearchParamReplacer('tags')
    const activeTags = value?.split(',') ?? []
    const allTags = uniq(
        boards.flatMap((board) => {
            return board?.meta?.tags ?? []
        }),
    )

    const filterTags: TTag[] = activeTags.filter((tag: TTag) =>
        allTags.includes(tag),
    )

    return (
        <Popover>
            <PopoverTrigger>
                <div className={classes.buttonWrapper}>
                    <SecondaryButton aria-label="Filtrer på merkelapper">
                        Filtrer på merkelapper
                        <FilterIcon aria-hidden="true" />
                    </SecondaryButton>
                    <NotificationBadge variant="primary" max={10}>
                        {filterTags.length}
                    </NotificationBadge>
                    <span className="visuallyHidden">merkelapper valgt</span>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-1">
                    <div className="flexRow justifyBetween">
                        <Heading4 className="m-1">
                            Filtrer på merkelapper
                        </Heading4>
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
                                onChange={() =>
                                    replace(xor(activeTags, [tag]).join(','))
                                }
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
