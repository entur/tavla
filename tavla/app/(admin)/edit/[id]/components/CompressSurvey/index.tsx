'use client'

import { useEffect, useState } from 'react'
import { Modal } from '@entur/modal'
import {
    Heading3,
    Heading4,
    Heading5,
    Paragraph,
    SubParagraph,
} from '@entur/typography'
import { Button, ButtonGroup } from '@entur/button'
import { SubmitButton } from 'components/Form/SubmitButton'
import { Radio, RadioGroup, Switch, TextArea } from '@entur/form'
import {
    getFormFeedbackForError,
    getFormFeedbackForField,
    TFormFeedback,
} from 'app/(admin)/utils'
import { useToast } from '@entur/alert'
import { FormError } from 'app/(admin)/components/FormError'
import { usePostHog } from 'posthog-js/react'
import ClientOnly from 'app/components/NoSSR/ClientOnly'
import { isEmptyOrSpaces } from 'app/(admin)/edit/utils'

const alternatives = [
    'Jeg var nysgjerrig på funksjonaliteten',
    'Jeg har behov for komprimert visning av tavlen min på grunn av liten skjerm',
    'Jeg ønsker ikke logo, klokke eller infomelding på tavlen min',
    'Annet',
]

function CompressSurvey() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<string>('')
    const [switchChecked, setSwitchChecked] = useState<boolean>(false)
    const [surveyID, setSurveyID] = useState<string>('')
    const { addToast } = useToast()
    const [formState, setFormError] = useState<TFormFeedback | undefined>(
        undefined,
    )
    const posthog = usePostHog()

    useEffect(() => {
        posthog.getActiveMatchingSurveys((surveys) => {
            if (surveys.length > 0) {
                const survey = surveys[0]
                if (survey) setSurveyID(survey.id)
            }
        })
    }, [posthog])

    const submitSurvey = async (data: FormData) => {
        const freeText = data.get('freeText') as string
        const selectedChoice = data.get('multipleChoice') as string

        if (selectedChoice || !isEmptyOrSpaces(freeText)) {
            posthog.capture('survey sent', {
                $survey_id: surveyID,
                $survey_response: selectedChoice,
                $survey_response_1: freeText ?? null,
            })
            setIsOpen(false)
            addToast('Tusen takk for din tilbakemelding!')
        } else {
            return setFormError(
                getFormFeedbackForError('survey/content-missing'),
            )
        }
    }

    const closeAndReset = () => {
        setIsOpen(false)
        setFormError(undefined)
        setSelectedOption('')
        setSwitchChecked(false)
    }

    return (
        <div>
            <div className="box">
                <div className="flex flex-row items-center gap-2">
                    <Heading3 margin="bottom">Komprimer Tavle</Heading3>
                </div>

                <SubParagraph>
                    Fjern klokke, logo og infomelding, slik at avgangene får mer
                    plass på skjermen din
                </SubParagraph>
                <div>
                    <Switch
                        checked={switchChecked}
                        onChange={() => setSwitchChecked(!switchChecked)}
                    >
                        Komprimer
                    </Switch>
                </div>

                <div className="flex flex-row mt-8 justify-end">
                    <SubmitButton
                        variant="secondary"
                        className="max-sm:w-full"
                        onClick={() => {
                            setIsOpen(true)
                            posthog.capture('COMPRESS_SETTING_SAVE_BTN')
                        }}
                    >
                        Lagre valg
                    </SubmitButton>
                </div>
            </div>
            <Modal
                size="medium"
                open={isOpen}
                onDismiss={() => {
                    closeAndReset()
                }}
            >
                <div>
                    <div className="flex flex-col gap-2">
                        <Heading4>
                            Vi holder på å utvikle denne funksjonaliteten!
                        </Heading4>
                        <Paragraph>
                            I mellomtiden ønsker vi din tilbakemelding!
                        </Paragraph>
                    </div>
                    <form
                        action={submitSurvey}
                        className="flex flex-col justify-between gap-2"
                    >
                        <Heading5>
                            Hvorfor trykket du på denne knappen?
                        </Heading5>
                        <RadioGroup
                            name="multipleChoice"
                            value={selectedOption}
                            onChange={(e) => {
                                setSelectedOption(e.target.value as string)
                            }}
                        >
                            <div className="flex flex-col items-start gap-8 sm:gap-2 w-full">
                                {alternatives.map((option) => (
                                    <Radio key={option} value={option}>
                                        {option}
                                    </Radio>
                                ))}
                            </div>
                        </RadioGroup>

                        <div className="flex flex-col gap-2">
                            <Heading5>Andre kommentarer</Heading5>
                            <ClientOnly>
                                <TextArea
                                    label="Utdyp gjerne!"
                                    name="freeText"
                                    id="freeText"
                                    defaultValue=""
                                />
                            </ClientOnly>
                        </div>
                        <div className="mt-4">
                            <FormError
                                {...getFormFeedbackForField(
                                    'general',
                                    formState,
                                )}
                            />
                        </div>
                        <div>
                            <ButtonGroup className="flex flex-row mt-8">
                                <SubmitButton variant="primary">
                                    Send
                                </SubmitButton>
                                <Button
                                    variant="secondary"
                                    onClick={() => {
                                        closeAndReset()
                                    }}
                                >
                                    Avbryt
                                </Button>
                            </ButtonGroup>
                        </div>
                    </form>
                </div>
            </Modal>
        </div>
    )
}

export { CompressSurvey }
