import { TTheme } from 'types/settings'
import { Dispatch, SetStateAction } from 'react'
import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown'
import { Heading4 } from '@entur/typography'
import { themes } from 'app/(admin)/edit/utils'

function ThemeSelect({
    selectedTheme,
    setSelectedTheme,
}: {
    selectedTheme: NormalizedDropdownItemType<TTheme> | null
    setSelectedTheme: Dispatch<
        SetStateAction<NormalizedDropdownItemType<TTheme> | null>
    >
}) {
    return (
        <div className="box flex flex-col gap-2">
            <Heading4 margin="bottom">Fargetema</Heading4>
            <div className="h-full">
                <Dropdown
                    items={themes}
                    selectedItem={selectedTheme}
                    onChange={setSelectedTheme}
                    label="Fargetema"
                />
            </div>
        </div>
    )
}

export { ThemeSelect }
