'use client'
import { TBoard, TTheme } from 'types/settings'
import { useState } from 'react'
import { Dropdown, NormalizedDropdownItemType } from '@entur/dropdown'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Heading3 } from '@entur/typography'
import { useToast } from '@entur/alert'
import { themeToDropdownItem, themes } from 'app/(admin)/edit/utils'
import { setTheme as setThemeAction } from './actions'

function ThemeSelect({ board }: { board: TBoard }) {
    const [selectedTheme, setSelectedTheme] =
        useState<NormalizedDropdownItemType<TTheme> | null>(
            themeToDropdownItem(board?.theme ?? 'dark'),
        )
    const { addToast } = useToast()

    const setTheme = async () => {
        const formFeedback = await setThemeAction(
            board.id ?? '',
            selectedTheme?.value ?? 'dark',
        )
        if (!formFeedback) {
            addToast('Fargetema lagret!')
        }
    }

    return (
        <form action={setTheme} className="box flex flex-col">
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
                    aria-label="Lagre fargetema"
                    className="max-sm:w-full"
                >
                    Lagre fargetema
                </SubmitButton>
            </div>
        </form>
    )
}

export { ThemeSelect }
