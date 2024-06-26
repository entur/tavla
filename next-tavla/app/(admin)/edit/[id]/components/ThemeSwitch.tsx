'use client'
import { TBoard, TTheme } from 'types/settings'
import { setTheme } from './MetaSettings/actions'
import { useState } from 'react'
import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Heading3 } from '@entur/typography'
import { themeToDropdownItem, themes } from '../../utils'

function ThemeSelect({ board }: { board: TBoard }) {
    const [selectedTheme, setSelectedTheme] =
        useState<NormalizedDropdownItemType<TTheme> | null>(
            themeToDropdownItem(board?.theme ?? 'dark'),
        )
    return (
        <form
            action={async () => {
                await setTheme(board.id ?? '', selectedTheme?.value ?? 'dark')
            }}
            className="box flex flex-col"
        >
            <div className="flex flex-row items-center gap-2">
                <Heading3 margin="bottom">Fargetema</Heading3>
            </div>

            <div className="h-full">
                <Dropdown
                    items={themes}
                    selectedItem={selectedTheme}
                    onChange={setSelectedTheme}
                    label="Fargetema"
                />
            </div>
            <div className="flex flex-row mt-8 justify-end">
                <SubmitButton
                    variant="secondary"
                    aria-label="Lagre kolonner"
                    className="max-sm:w-full"
                >
                    Lagre fargetema
                </SubmitButton>
            </div>
        </form>
    )
}

export { ThemeSelect }
