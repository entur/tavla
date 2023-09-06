import { IconButton, SecondaryButton } from '@entur/button'
import { FilterChip } from '@entur/chip'
import { AdjustmentsIcon, CloseIcon } from '@entur/icons'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
} from '@entur/tooltip'
import { Heading4 } from '@entur/typography'
import classes from './styles.module.css'

function FilterButton({
    possibleFilters,
    handleFilterChange,
}: {
    possibleFilters: string[]
    handleFilterChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}) {
    return (
        <Popover>
            <PopoverTrigger>
                <SecondaryButton>
                    <AdjustmentsIcon aria-hidden="true" />
                    Filtrer
                </SecondaryButton>
            </PopoverTrigger>
            <PopoverContent>
                <div className={classes.filterPopover}>
                    <div className={classes.popoverHeading}>
                        <Heading4 className={classes.tagsHeading}>
                            Tags
                        </Heading4>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <div className={classes.filterTags}>
                        {possibleFilters.map((filter) => (
                            <FilterChip
                                className={classes.filterTag}
                                key={filter}
                                value={filter}
                                onChange={handleFilterChange}
                            >
                                {filter}
                            </FilterChip>
                        ))}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { FilterButton }
