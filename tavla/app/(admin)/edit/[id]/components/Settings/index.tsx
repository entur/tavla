'use client'
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
import { ViewTypeSetting } from './ViewType'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useToast } from '@entur/alert'
import { useRef, useState } from 'react'
import {
    getFormFeedbackForField,
    InputType,
    TFormFeedback,
} from 'app/(admin)/utils'
import { saveSettings } from './actions'
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
    const formRef = useRef<HTMLFormElement>(null)
    const { pointItems, selectedPoint, setSelectedPoint } = usePointSearch(
        meta.location,
    )
    const { addToast } = useToast()
    const [errors, setFormErrors] = useState<
        Partial<Record<InputType, TFormFeedback>>
    >({})

    const submitSettings = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget)

        const errors = await saveSettings(
            data,
            selectedPoint?.value as TLocation,
        )

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
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
                onSubmit={submitSettings}
                ref={formRef}
            >
                <div className="box">
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
                            boardInOrganization={organization !== undefined}
                        />

                        <HiddenInput id="bid" value={board.id} />
                    </div>
                </div>
                <FormError
                    {...getFormFeedbackForField('general', errors.general)}
                />
                <div>
                    <SubmitButton variant="primary">Lagre</SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { Settings }
