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
    ID_UNAVAILABE = 'Ikke ledig: Denne Tavla-linken er dessverre i bruk.',
    ID_SET = 'Din nye Tavla-link er nå opprettet!',
    EMPTY_STRING = 'Tomt felt: Tavle-linken kan ikke være tom.',
    NOTHING = '',
}

enum inputFeedbackClass {
    SUCCSESS = 'succsessMessage',
    FAILURE = 'errorMessage',
}

const CustomURL = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()

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
        }
        copySettingsToNewId(customUrlInput, settings).then((success) => {
            if (success) {
                setIdToBeDeleted(currentDoc)
                handleNewIdVisuals()
            } else {
                handleFailedInputVisuals(inputFeedback.ID_UNAVAILABE)
            }
        })
    }

    const handleNewIdVisuals = () => {
        setFeedbackMeessageClass(inputFeedbackClass.SUCCSESS)
        setFeedbackMessage(inputFeedback.ID_SET)
        setCurrentDoc(customUrlInput)
        history.replaceState({}, '', customUrlInput)
        setCustomUrlInput('')
    }

    const handleFailedInputVisuals = (inputFeedback: inputFeedback) => {
        setFeedbackMeessageClass(inputFeedbackClass.FAILURE)
        setFeedbackMessage(inputFeedback)
    }

    return (
        <div className="customUrl">
            <Heading3 className="heading">Lag egen Tavla-link</Heading3>
            <Paragraph className="logo-page__paragraph">
                Her kan du lage en selvbestemt link til tavla di. Dette gjør det
                både lettere for deg óg andre å ha tilgang til tavla di. Linken
                kan kun inneholde bokstaver (ikke æ, ø og å), tall, bindestrek
                «-» og understrek «_».
            </Paragraph>
            <Paragraph>
                <EmphasizedText>
                    Obs, den gamle tavlelinken din slutter å fungere hvis du
                    setter en ny.
                </EmphasizedText>
            </Paragraph>
            <Label>Linkaddresse</Label>

            <div
                style={{
                    display: 'flex',
                    justifyContent: 'center',
                    paddingBottom: '5px',
                }}
            >
                <TextField
                    value={customUrlInput}
                    onChange={handleCustomUrlChange}
                    maxLength={80}
                    placeholder={currentDoc}
                    prepend="tavla.entur.no/t/"
                />
                <Tooltip content="Sett Tavla-link" placement="top">
                    <SecondarySquareButton
                        style={{ marginLeft: '1em' }}
                        onClick={tryAddCustomUrl}
                        aria-label="Sett Tavla-link"
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
