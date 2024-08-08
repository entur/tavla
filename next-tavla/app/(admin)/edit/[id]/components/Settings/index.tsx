'use client'
import {
    TBoard,
    TBoardID,
    TFooter,
    TOrganization,
    TOrganizationID,
    TTheme,
} from 'types/settings'
import { Name } from './Name'
import { Organization } from './Organization'
import { Address } from './Adress'
import { Footer } from './Footer'
import { FontChoice } from './FontChoice'
import { ThemeSelect } from './ThemeSelect'
import { Heading2 } from '@entur/typography'
import { useToast } from '@entur/alert'
import { useState } from 'react'
import { moveBoard, saveSettings, saveLocation } from './actions'
import { TFontSize } from 'types/meta'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { PrimaryButton } from '@entur/button'
import { isEqual } from 'lodash'

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
    const [newOrganizationID, setNewOrganizationID] = useState<
        TOrganizationID | undefined
    >()

    const [isError, setIsError] = useState(false)

    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch(
        board.meta.location,
    )

    return (
        <>
            <form
                id="settings"
                action={async (data: FormData) => {
                    const name = data.get('name') as string
                    const fontSize = data.get('font') as TFontSize
                    const theme = data.get('theme') as TTheme

                    const footer = data.get('footer') as string
                    const override = data.get('override') as string
                    const overrideOrg = override !== 'on'

                    const newMeta = {
                        title: name,
                        fontSize: fontSize,
                    }

                    const newFooter = {
                        footer: footer,
                        override: overrideOrg ?? true,
                    } as TFooter

                    newOrganizationID !== organization?.id &&
                        (await moveBoard(
                            bid,
                            newOrganizationID,
                            organization?.id,
                        ))

                    !isEqual(selectedPoint?.value, board.meta.location) &&
                        (await saveLocation(bid, selectedPoint?.value))

                    await saveSettings(bid, newMeta, theme, newFooter)

                    addToast('Lagret!')
                }}
            >
                <div className="flex flex-row justify-between">
                    <Heading2>Innstillinger</Heading2>
                    <PrimaryButton
                        type="submit"
                        className="max-sm:w-full"
                        form="settings"
                        disabled={isError}
                    >
                        Lagre valg
                    </PrimaryButton>
                </div>
                <div className="grid md:grid-cols-2 gap-x-5 gap-y-4 pt-6">
                    <Name title={board.meta.title} setIsError={setIsError} />
                    <Organization
                        organizationBoard={organization}
                        setNewOrganizationID={setNewOrganizationID}
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
                    <ThemeSelect theme={board.theme ?? 'dark'} />
                </div>
            </form>
        </>
    )
}

export { Settings }
