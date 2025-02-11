'use client'
import { ButtonGroup, Button } from '@entur/button'
import { Heading2 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TMeta } from 'types/meta'
import { TBoard, TOrganization } from 'types/settings'
import { BoardSettings } from '../BoardSetttings'
import { MetaSettings } from '../MetaSettings'
import { FormEvent } from 'react'
import { WalkingDistance } from '../MetaSettings/WalkingDistance'
import { Footer } from '../Footer'
import { ThemeSelect } from '../ThemeSelect'
import { FontSelect } from '../MetaSettings/FontSelect'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
function Settings({
    board,
    meta,
    organization,
}: {
    board: TBoard
    meta: TMeta
    organization?: TOrganization
}) {
    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch(
        meta.location,
    )

    return (
        <div className="rounded-md md:py-8 py-2 md:px-6 px-2 flex flex-col gap-4 bg-background">
            <Heading2>Innstillinger</Heading2>
            <form
                className="grid grid-cols md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8"
                onSubmit={(e) => {
                    e.preventDefault()
                    const formData = new FormData(
                        e.currentTarget as HTMLFormElement,
                    )
                }}
            >
                <MetaSettings
                    bid={board.id!}
                    meta={board.meta}
                    organization={organization}
                />

                <BoardSettings
                    board={board}
                    meta={board.meta}
                    organization={organization}
                >
                    <WalkingDistance
                        bid={board.id!}
                        pointItems={pointItems}
                        selectedPoint={selectedPoint}
                        setSelectedPoint={setSelectedPoint}
                    />
                    <Footer
                        bid={board.id!}
                        footer={board.footer}
                        organizationBoard={organization !== undefined}
                    />
                    <ThemeSelect board={board} />
                    <FontSelect
                        bid={board.id!}
                        font={meta?.fontSize ?? 'medium'}
                    />
                </BoardSettings>
                <div>
                    <ButtonGroup className="flex flex-row mt-8">
                        <SubmitButton variant="primary">
                            Lagre valg
                        </SubmitButton>
                        <Button variant="secondary" type="button">
                            Avbryt
                        </Button>
                    </ButtonGroup>
                </div>
            </form>
        </div>
    )
}

export { Settings }
