'use client'
import { ButtonGroup, Button } from '@entur/button'
import { Heading2, Heading3 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TLocation, TMeta } from 'types/meta'
import { TBoard, TOrganization } from 'types/settings'
import { WalkingDistance } from './WalkingDistance'
import { Footer } from './Footer'
import { ThemeSelect } from './ThemeSelect'
import { usePointSearch } from 'app/(admin)/hooks/usePointSearch'
import { Title } from './Title'
import { Organization } from './Organization'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { useOrganizations } from 'app/(admin)/hooks/useOrganizations'
import { ViewTypeSetting } from './ViewType'
import { usePostHog } from 'posthog-js/react'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useToast } from '@entur/alert'
import { useState } from 'react'
import {
    getFormFeedbackForField,
    InputType,
    TFormFeedback,
} from 'app/(admin)/utils'
import { saveForm } from './actions'
import { FormError } from 'app/(admin)/components/FormError'
import { FontSelect } from './FontSelect'

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
    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch(
        meta.location,
    )
    const { organizations, selectedOrganization, setSelectedOrganization } =
        useOrganizations(organization)
    const { addToast } = useToast()
    const [errors, setFormErrors] = useState<
        Partial<Record<InputType, TFormFeedback>>
    >({})

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget)
        data.append('organization', selectedOrganization?.value.id as string)
        posthog.capture('SAVE_VIEW_TYPE_BTN', {
            value: data.get('viewType') as string,
        })

        const errors = await saveForm(data, selectedPoint?.value as TLocation)

        if (!errors) {
            setFormErrors({})
            addToast('Innstillinger lagret!')
        } else {
            setFormErrors(errors)
        }
    }

    return (
        <div className="rounded-md md:py-8 py-2 md:px-6 px-2 flex flex-col gap-4 bg-background">
            <Heading2>Innstillinger</Heading2>
            <form
                className="grid grid-cols md:grid-cols-[repeat(auto-fill,minmax(500px,1fr))] gap-8"
                onSubmit={handleSubmit}
            >
                <div className="box  ">
                    <Heading3 margin="bottom"> Generelt </Heading3>
                    <div className="flex flex-col gap-4">
                        <Title
                            title={meta?.title ?? DEFAULT_BOARD_NAME}
                            feedback={getFormFeedbackForField(
                                'name',
                                errors.name,
                            )}
                        />
                        <Organization
                            organization={organization}
                            organizations={organizations}
                            selectedOrganization={selectedOrganization}
                            setSelectedOrganization={setSelectedOrganization}
                            feedback={getFormFeedbackForField(
                                'organization',
                                errors.organization,
                            )}
                        />
                    </div>
                </div>
                <div className="box">
                    <Heading3 margin="bottom">Tavlevisning </Heading3>
                    <div className=" flex flex-col gap-4">
                        <ViewTypeSetting board={board} />
                        <ThemeSelect board={board} />
                        <FontSelect
                            bid={board.id!}
                            font={meta?.fontSize ?? 'medium'}
                        />
                        <WalkingDistance
                            pointItems={pointItems}
                            selectedPoint={selectedPoint}
                            setSelectedPoint={setSelectedPoint}
                        />
                        <Footer
                            footer={board.footer}
                            organizationBoard={organization !== undefined}
                        />

                        <HiddenInput id="bid" value={board.id} />

                        <HiddenInput
                            id="fromOrg"
                            value={organization?.id ?? ''}
                        />
                    </div>
                </div>
                <FormError
                    {...getFormFeedbackForField('general', errors.general)}
                />
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
