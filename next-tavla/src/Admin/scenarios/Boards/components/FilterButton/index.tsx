import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
} from '@entur/tooltip'
import { IconButton, SecondaryButton } from '@entur/button'
import { Heading2 } from '@entur/typography'
import { CloseIcon, FilterIcon } from '@entur/icons'
import {
    useBoardsSettings,
    useBoardsSettingsDispatch,
} from '../../utils/context'
import { TTag } from 'types/meta'
import { FilterChip } from '@entur/chip'
import { uniq } from 'lodash'
import classes from './styles.module.css'
import { NotificationBadge } from '@entur/layout'
import { VisuallyHidden } from '@entur/a11y'

function FilterButton() {
    const { filterTags, boards } = useBoardsSettings()
    const dispatch = useBoardsSettingsDispatch()

    const allTags = uniq(
        boards.flatMap((board) => {
            return board?.meta?.tags ?? []
        }),
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
                        {filterTags.length}
                    </NotificationBadge>
                    <VisuallyHidden>merkelapper valgt</VisuallyHidden>
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
                                onChange={() =>
                                    dispatch({
                                        type: 'toggleFilterTag',
                                        tag,
                                    })
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
