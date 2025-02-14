'use client'
import { ButtonGroup, Button } from '@entur/button'
import { Heading2 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TMeta } from 'types/meta'
import { TBoard, TOrganization } from 'types/settings'
import { BoardSettings } from '../BoardSetttings'
import { MetaSettings } from '../MetaSettings'
import { saveForm } from './actions'
import { WalkingDistance } from '../MetaSettings/WalkingDistance'
import { Footer } from '../Footer'
import { ThemeSelect } from '../ThemeSelect'
import { FontSelect } from '../MetaSettings/FontSelect'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { Title } from '../MetaSettings/Title'
import { Organization } from '../MetaSettings/Organization'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { ViewTypeSetting } from '../ViewType'
import { usePostHog } from 'posthog-js/react'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useToast } from '@entur/alert'

function Settings({
    board,
    meta,
    organization,
}: {
    board: TBoard
    meta: TMeta
    organization?: TOrganization
}) {
    const posthog = usePostHog()
    const submit = async (data: FormData) => {
        data.append('organization', selectedOrganization?.value as string)
        posthog.capture('SAVE_VIEW_TYPE_BTN', {
            value: data.get('viewType') as string,
        })
        await saveForm(undefined, data)
    }
    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch(
        meta.location,
    )
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(organization)
    const { addToast } = useToast()
    return (
        <div className="rounded-md md:py-8 py-2 md:px-6 px-2 flex flex-col gap-4 bg-background">
            <Heading2>Innstillinger</Heading2>
            <form
                className="grid grid-cols md:grid-cols-[repeat(auto-fill,minmax(400px,1fr))] gap-8"
                onSubmit={async (e) => {
                    e.preventDefault()

                    const data = new FormData(e.currentTarget)
                    data.append(
                        'organization',
                        selectedOrganization?.value.id as string,
                    )
                    data.append(
                        'location',
                        JSON.stringify(selectedPoint?.value),
                    )
                    const res = await saveForm(undefined, data)
                    if (!res) {
                        addToast('Innstillinger lagret!')
                    }
                }}
            >
                <MetaSettings>
                    <Title title={meta?.title ?? DEFAULT_BOARD_NAME} />
                    <Organization
                        organization={organization}
                        organizations={organizations}
                        selectedOrganization={selectedOrganization}
                        setSelectedOrganization={setSelectedOrganization}
                    />
                </MetaSettings>

                <BoardSettings>
                    <ViewTypeSetting board={board} />
                    <WalkingDistance
                        pointItems={pointItems}
                        selectedPoint={selectedPoint}
                        setSelectedPoint={setSelectedPoint}
                    />
                    <Footer
                        footer={board.footer}
                        organizationBoard={organization !== undefined}
                    />
                    <ThemeSelect board={board} />
                    <FontSelect
                        bid={board.id!}
                        font={meta?.fontSize ?? 'medium'}
                    />
                    <HiddenInput id="bid" value={board.id} />
                    <HiddenInput id="fromOrg" value={organization?.id ?? ''} />
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
