'use client'

import { ChoiceChip, ChoiceChipGroup } from '@entur/chip'
import { NightIcon, SunIcon } from '@entur/icons'
import TavlaDarkMode from 'assets/illustrations/TavlaDarkMode.svg'
import TavlaLightMode from 'assets/illustrations/TavlaLightMode.svg'
import Image from 'next/image'
import { useState } from 'react'

export function ThemeFeature() {
    const [theme, setTheme] = useState<'light' | 'dark' | 'undefined'>()

    return (
        <>
            <div className="absolute top-4 right-4 z-10 bg-white rounded-xl p-4 border border-[#D9DAE8] w-56 flex flex-col justify-center items-center">
                <ChoiceChipGroup
                    className="h-full ml-em-0.75 py-2"
                    name={`feature_demo_theme_${theme}`}
                    value={theme ?? 'light'}
                    onChange={(e) => {
                        setTheme(e.target.value as 'light' | 'dark')
                    }}
                >
                    <ChoiceChip key="light" value="light">
                        <SunIcon /> Lys
                    </ChoiceChip>
                    <ChoiceChip key="dark" value="dark">
                        <NightIcon /> Mørk
                    </ChoiceChip>
                </ChoiceChipGroup>
            </div>
            <div className="w-full h-full pt-20 p-5 sm:pt-20 sm:pl-8 flex justify-start items-start">
                {theme === 'dark' ? (
                    <Image
                        src={TavlaDarkMode}
                        alt="Tavla i mørk fargemodus"
                        className="w-[200%] sm:w-[150%] lg:w-[1000px] sm:min-w-[800px] h-auto max-w-none object-cover object-left-top rounded-tl-md sm:rounded-tl-xl shadow-lg"
                    />
                ) : (
                    <Image
                        src={TavlaLightMode}
                        alt="Tavla i lyst fargemodus"
                        className="w-[200%] sm:w-[150%] lg:w-[1000px] sm:min-w-[800px] h-auto max-w-none object-cover object-left-top rounded-tl-md sm:rounded-tl-xl shadow-lg"
                    />
                )}
            </div>
        </>
    )
}
