import React, { useState } from 'react'

import { logEvent } from '@firebase/analytics'

import {
    Label,
    Paragraph,
    EmphasizedText,
    UnorderedList,
    ListItem,
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
import { analytics } from '../../../../firebase-init'

import '../styles.scss'

enum inputFeedback {
    ID_UNAVAILABLE = 'Ikke ledig: Denne Tavla-lenken er dessverre i bruk.',
    ID_SET = 'Din nye Tavla-lenke er nå opprettet!',
    EMPTY_STRING = 'Tomt felt: Tavle-lenken kan ikke være tom.',
    TOO_SHORT = 'For kort: Tavle-lenken må være på minst seks tegn.',
    NOTHING = '',
}

enum inputFeedbackType {
    SUCCESS = 'success',
    FAILURE = 'error',
    CLEAR = 'info',
}

const CustomURL = (): JSX.Element => {
    const [settings] = useSettingsContext()

    const [customUrlInput, setCustomUrlInput] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState(
        inputFeedback.NOTHING,
    )
    const [feedbackMessageType, setFeedbackMessageType] = useState(
        inputFeedbackType.CLEAR,
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
            setFeedbackMessageType(inputFeedbackType.CLEAR)
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
                logEvent(analytics, 'create_custom_url')
            } else {
                handleFailedInputVisuals(inputFeedback.ID_UNAVAILABLE)
            }
        })
    }

    const handleNewIdVisuals = () => {
        setFeedbackMessageType(inputFeedbackType.SUCCESS)
        setFeedbackMessage(inputFeedback.ID_SET)
        setCurrentDoc(customUrlInput)
        history.replaceState({}, '', customUrlInput)
        setCustomUrlInput('')
    }

    const handleFailedInputVisuals = (feedback: inputFeedback) => {
        setFeedbackMessageType(inputFeedbackType.FAILURE)
        setFeedbackMessage(feedback)
    }

    const Requirements = (): JSX.Element => (
        <>
            <Label className="label">Krav til Tavla-lenke</Label>
            <UnorderedList>
                <ListItem>Tavla-lenken må bestå av minst seks tegn.</ListItem>
                <ListItem>
                    Tavla-lenken kan kun bestå av bokstaver, tall, understrek
                    «_» og bindestrek&nbsp;«-».
                </ListItem>
                <ListItem>
                    Tavla-lenken kan ikke inneholde æ, ø eller å.
                </ListItem>
            </UnorderedList>
        </>
    )

    return (
        <div className="custom-url">
            <Paragraph className="name-page__paragraph">
                Her kan du lage en selvbestemt lenke til tavla di. Dette gjør
                det både lettere for deg óg andre å ha tilgang til tavla di.
            </Paragraph>
            <Paragraph className="name-page__paragraph">
                <EmphasizedText>
                    Obs, den gamle Tavla-lenken din vil slettes hvis du setter
                    en ny.
                </EmphasizedText>
            </Paragraph>
            <Requirements />
            <div className="input-area">
                <Paragraph className="prepend">tavla.entur.no/t/</Paragraph>
                <div className="input-field">
                    <TextField
                        label="Ønsket lenkeadresse"
                        value={customUrlInput}
                        onChange={handleCustomUrlChange}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') tryAddCustomUrl()
                        }}
                        maxLength={80}
                        variant={feedbackMessageType}
                        feedback={feedbackMessage}
                    />
                </div>
                <div className="submit-button">
                    <Tooltip content="Sett Tavla-lenke" placement="top">
                        <SecondarySquareButton
                            onClick={tryAddCustomUrl}
                            aria-label="Sett Tavla-lenke"
                        >
                            <CheckIcon />
                        </SecondarySquareButton>
                    </Tooltip>
                </div>
            </div>
        </div>
    )
}

export default CustomURL
