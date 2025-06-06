'use client'
import { Heading2, Heading3 } from '@entur/typography'
import { SubmitButton } from 'components/Form/SubmitButton'
import { TBoard, TOrganization } from 'types/settings'
import { WalkingDistance } from './components/WalkingDistance'
import { Footer } from './components/Footer'
import { ThemeSelect } from './components/ThemeSelect'
import { Title } from './components/Title'
import { Organization } from './components/Organization'
import { DEFAULT_BOARD_NAME } from 'app/(admin)/utils/constants'
import { ViewType } from './components/ViewType'
import { HiddenInput } from 'components/Form/HiddenInput'
import { useToast } from '@entur/alert'
import { useState } from 'react'
import {
    getFormFeedbackForField,
    InputType,
    TFormFeedback,
} from 'app/(admin)/utils'
import { saveSettings } from './actions'
import { FormError } from 'app/(admin)/components/FormError'
import { FontSelect } from './components/FontSelect'

function Settings({
    board,
    organization,
}: {
    board: TBoard
    organization?: TOrganization
}) {
    const { addToast } = useToast()

    const [formErrors, setFormErrors] = useState<
        Partial<Record<InputType, TFormFeedback>>
    >({})

    const submitSettings = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const data = new FormData(e.currentTarget)

        const resultingErrors = await saveSettings(data)

        if (!resultingErrors) {
            setFormErrors({})
            addToast('Innstillinger lagret!')
        } else {
            setFormErrors(resultingErrors)
        }
    }

    return (
        <div className="flex flex-col gap-4 rounded-md bg-background px-2 py-2 md:px-6 md:py-8">
            <Heading2>Innstillinger</Heading2>
            <form
                className="grid grid-cols-1 gap-8 lg:grid-cols-2"
                onSubmit={submitSettings}
            >
                <div className="box">
                    <Heading3 margin="bottom"> Generelt </Heading3>
                    <div className="flex flex-col gap-4">
                        <Title
                            title={board.meta?.title ?? DEFAULT_BOARD_NAME}
                            feedback={getFormFeedbackForField(
                                'name',
                                formErrors.name,
                            )}
                        />
                        <Organization organization={organization} />
                    </div>
                </div>
                <div className="box">
                    <Heading3 margin="bottom">Tavlevisning </Heading3>
                    <div className="flex flex-col gap-4">
                        <ViewType
                            hasCombinedTiles={
                                board.combinedTiles ? true : false
                            }
                        />
                        <ThemeSelect theme={board.theme} />
                        <FontSelect font={board.meta.fontSize} />
                        <WalkingDistance location={board.meta.location} />
                        <Footer footer={board.footer} />
                        <HiddenInput id="bid" value={board.id} />
                    </div>
                </div>
                <FormError
                    {...getFormFeedbackForField('general', formErrors.general)}
                />
                <div>
                    <SubmitButton variant="primary">Lagre</SubmitButton>
                </div>
            </form>
        </div>
    )
}

export { Settings }
