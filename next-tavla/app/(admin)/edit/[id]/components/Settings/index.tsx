'use client'
import {
    TBoard,
    TBoardID,
    TOrganization,
    TOrganizationID,
    TTheme,
} from 'types/settings'
import { Name } from './Name'
import { Organization } from './Organization'
import { Address } from './Adress'
import { Footer } from '../Footer'
import { FontChoice } from './FontChoice'
import { ThemeSelect } from '../ThemeSelect'
import { Heading2 } from '@entur/typography'
import { useToast } from '@entur/alert'
import { themeToDropdownItem } from 'app/(admin)/edit/utils'
import { useState } from 'react'
import { moveBoard, saveFont, saveLocation, saveTitle } from './actions'
import { setFooter } from '../Footer/actions'
import { TFontSize } from 'types/meta'
import { NormalizedDropdownItemType } from '@entur/dropdown'
import { setTheme } from '../ThemeSelect/actions'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { PrimaryButton } from '@entur/button'

function Settings({
    bid,
    board,
    organization,
}: {
    bid: TBoardID
    board: TBoard
    organization?: TOrganization
}) {
    const { addToast } = useToast()
    const [organizationID, setOrganizaionID] = useState<
        TOrganizationID | undefined
    >()

    const [isError, setIsError] = useState(false)

    const [selectedTheme, setSelectedTheme] =
        useState<NormalizedDropdownItemType<TTheme> | null>(
            themeToDropdownItem(board?.theme ?? 'dark'),
        )

    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch(
        board.meta.location,
    )

    return (
        <>
            <form
                id="settings"
                action={async (data: FormData) => {
                    const name = data.get('name') as string

                    const footer = data.get('footer') as string
                    const override = data.get('override') as string
                    const overrideOrg = override !== 'on'

                    // nå kjører denne alltid, vil vi sjekke om noe er forandret for å så endre?
                    await setFooter(bid, {
                        footer: footer,
                        override: overrideOrg ?? true,
                    })

                    await moveBoard(bid, organizationID, organization?.id)
                    await saveTitle(bid, name)

                    const font = data.get('font') as TFontSize
                    await saveFont(bid, font)

                    await saveLocation(bid, selectedPoint?.value)
                    await setTheme(
                        board.id ?? '',
                        selectedTheme?.value ?? 'dark',
                    )

                    addToast('Lagret!')
                }}
            >
                <div className="grid grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8">
                    <Heading2>Innstillinger</Heading2>
                    <PrimaryButton
                        type="submit"
                        className="max-sm:w-full"
                        form="settings"
                        disabled={isError}
                    >
                        Lagre valg
                    </PrimaryButton>

                    <Name title={board.meta.title} setIsError={setIsError} />
                    <Organization
                        organization={organization}
                        setOrg={setOrganizaionID}
                        setIsError={setIsError}
                    />
                    <Address
                        pointItems={pointItems}
                        selectedPoint={selectedPoint}
                        setSelectedPoint={setSelectedPoint}
                    />
                    <Footer
                        footer={board.footer}
                        organizationBoard={organization !== undefined}
                    />
                    <FontChoice fontSize={board.meta.fontSize} />
                    <ThemeSelect
                        selectedTheme={selectedTheme}
                        setSelectedTheme={setSelectedTheme}
                    />
                </div>
            </form>
        </>
    )
}

export { Settings }
