'use client'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverCloseButton,
} from '@entur/tooltip'
import { IconButton, SecondaryButton } from '@entur/button'
import { Heading4, Paragraph } from '@entur/typography'
import { CloseIcon, FilterIcon } from '@entur/icons'
import { TTag } from 'types/meta'
import { FilterChip } from '@entur/chip'
import { NotificationBadge } from '@entur/layout'
import { useSearchParamReplacer } from '../../hooks/useSearchParamReplacer'
import { useEffect, useState } from 'react'
import { xor } from 'lodash'

function FilterButton({ filterOptions }: { filterOptions?: TTag[] }) {
    const [value, replace] = useSearchParamReplacer('tags')

    const [activeTags, setActiveTags] = useState<TTag[]>(
        value?.split(',') ?? [],
    )

    useEffect(() => {
        replace(activeTags.join(','))
    }, [activeTags, replace])

    const handleFilterChipChange = (tag: TTag) => {
        const newTags = xor(activeTags, [tag])
        setActiveTags(newTags)
    }

    return (
        <Popover>
            <PopoverTrigger>
                <div className="relative [&>span]:absolute [&>span]:top-[-10px] [&>span]:right-[-10px]">
                    <SecondaryButton
                        aria-label="Filtrer på merkelapper"
                        className="w-full"
                    >
                        Merkelapper
                        <FilterIcon aria-hidden="true" />
                    </SecondaryButton>
                    <NotificationBadge variant="primary" max={10}>
                        {activeTags.length}
                    </NotificationBadge>
                    <span className="visuallyHidden">merkelapper valgt</span>
                </div>
            </PopoverTrigger>
            <PopoverContent>
                <div className="p-4">
                    <div className="flex flex-row justify-between gap-4 items-center">
                        <Heading4 margin="none">Merkelapper</Heading4>
                        <PopoverCloseButton>
                            <IconButton aria-label="Lukk popover">
                                <CloseIcon aria-hidden="true" />
                            </IconButton>
                        </PopoverCloseButton>
                    </div>
                    <div className="max-w-96 flex flex-wrap gap-2 pt-2">
                        {filterOptions?.length === 0 ? (
                            <Paragraph>
                                Du har ikke lagt til noen merkelapper.
                            </Paragraph>
                        ) : (
                            filterOptions?.sort().map((tag: TTag) => (
                                <FilterChip
                                    type="checkbox"
                                    key={tag}
                                    checked={activeTags.includes(tag)}
                                    onChange={() => handleFilterChipChange(tag)}
                                    value={tag}
                                >
                                    {tag}
                                </FilterChip>
                            ))
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export { FilterButton }
