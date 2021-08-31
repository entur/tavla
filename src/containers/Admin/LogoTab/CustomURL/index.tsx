import React, { useState } from 'react'

import {
    Label,
    Heading3,
    Paragraph,
    EmphasizedText,
    StrongText,
} from '@entur/typography'
import { TextField } from '@entur/form'
import { SecondarySquareButton } from '@entur/button'
import { CheckIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

import {
    copySettingsToNewId,
    setIdToBeDeleted,
} from '../../../../services/firebase'

import { useSettingsContext } from '../../../../settings'
import { getDocumentId } from '../../../../utils'

import '../styles.scss'

enum inputFeedback {
    ID_UNAVAILABLE = 'Ikke ledig: Denne Tavla-lenken er dessverre i bruk.',
    ID_SET = 'Din nye Tavla-lenke er nå opprettet!',
    EMPTY_STRING = 'Tomt felt: Tavle-lenken kan ikke være tom.',
    TOO_SHORT = 'For kort: Tavle-lenken må være på minst seks tegn.',
    NOTHING = '',
}

enum inputFeedbackClass {
    SUCCESS = 'success-message',
    FAILURE = 'error-message',
}

const CustomURL = (): JSX.Element => {
    const [settings] = useSettingsContext()

    const [customUrlInput, setCustomUrlInput] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState(
        inputFeedback.NOTHING,
    )
    const [feedbackMessageClass, setFeedbackMeessageClass] = useState(
        inputFeedbackClass.FAILURE,
    )
    const [currentDoc, setCurrentDoc] = useState(getDocumentId() as string)

    const handleCustomUrlChange = (
        event: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        if (event.currentTarget.value.match(/[^A-Za-z0-9_-]/g)) {
            event.currentTarget.value = event.currentTarget.value.replace(
                /[^A-Za-z0-9_-]/g,
                '',
            )
        }
        setCustomUrlInput(event.target.value)
        if (feedbackMessage) {
            setFeedbackMessage(inputFeedback.NOTHING)
        }
    }

    const tryAddCustomUrl = () => {
        if (!customUrlInput) {
            handleFailedInputVisuals(inputFeedback.EMPTY_STRING)
            return
        } else if (customUrlInput.length < 6) {
            handleFailedInputVisuals(inputFeedback.TOO_SHORT)
            return
        }
        copySettingsToNewId(customUrlInput, settings).then((success) => {
            if (success) {
                setIdToBeDeleted(currentDoc)
                handleNewIdVisuals()
            } else {
                handleFailedInputVisuals(inputFeedback.ID_UNAVAILABLE)
            }
        })
    }

    const handleNewIdVisuals = () => {
        setFeedbackMeessageClass(inputFeedbackClass.SUCCESS)
        setFeedbackMessage(inputFeedback.ID_SET)
        setCurrentDoc(customUrlInput)
        history.replaceState({}, '', customUrlInput)
        setCustomUrlInput('')
    }

    const handleFailedInputVisuals = (feedback: inputFeedback) => {
        setFeedbackMeessageClass(inputFeedbackClass.FAILURE)
        setFeedbackMessage(feedback)
    }

    return (
        <div className="custom-url">
            <Heading3 className="heading">Lag egen Tavla-lenke</Heading3>
            <Paragraph className="logo-page__paragraph">
                Her kan du lage en selvbestemt lenke til tavla di. Dette gjør
                det både lettere for deg óg andre å ha tilgang til tavla di.
                Lenken kan kun inneholde bokstaver (ikke æ, ø og å), tall,
                bindestrek «-» og understrek «_» og må inneholde minst seks
                tegn.
            </Paragraph>
            <Paragraph>
                <EmphasizedText>
                    Obs, den gamle Tavla-lenken din vil slutte å fungere hvis du
                    setter en ny.
                </EmphasizedText>
            </Paragraph>
            <Label>Linkaddresse</Label>

            <div className="input-area">
                <TextField
                    value={customUrlInput}
                    onChange={handleCustomUrlChange}
                    maxLength={80}
                    placeholder={currentDoc}
                    prepend="tavla.entur.no/t/"
                />
                <Tooltip content="Sett Tavla-lenke" placement="top">
                    <SecondarySquareButton
                        className="submit-button"
                        onClick={tryAddCustomUrl}
                        aria-label="Sett Tavla-lenke"
                    >
                        <CheckIcon />
                    </SecondarySquareButton>
                </Tooltip>
            </div>
            {feedbackMessage && (
                <StrongText className={feedbackMessageClass}>
                    {feedbackMessage}
                </StrongText>
            )}
        </div>
    )
}

export default CustomURL
