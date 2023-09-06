import { SecondaryButton } from '@entur/button'
import { FilterChip } from '@entur/chip'
import { AdjustmentsIcon } from '@entur/icons'
import { Popover, PopoverTrigger, PopoverContent } from '@entur/tooltip'
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
                    <Heading4>Tags</Heading4>
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
