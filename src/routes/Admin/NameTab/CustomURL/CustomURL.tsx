import React, { useCallback, useState } from 'react'
import { useParams } from 'react-router-dom'
import { copySettingsToNewId, updateFirebaseSettings } from 'settings/firebase'
import { useUser } from 'settings/UserProvider'
import { useSettings } from 'settings/SettingsProvider'
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
import classes from '../NameTab.module.scss'

enum inputFeedback {
    ID_UNAVAILABLE = 'Ikke ledig: Denne Tavla-lenken er dessverre i bruk.',
    ID_SET = 'Din nye Tavla-lenke er nå opprettet!',
    EMPTY_STRING = 'Tomt felt: Tavle-lenken kan ikke være tom.',
    TOO_SHORT = 'For kort: Tavle-lenken må være på minst seks tegn.',
    NOT_OWNER = 'Du har ikke rettigheter til å endre tavlelenken.',
    NOTHING = '',
}

enum inputFeedbackType {
    SUCCESS = 'success',
    FAILURE = 'error',
    CLEAR = 'info',
}

function CustomURL() {
    const user = useUser()
    const [settings] = useSettings()

    const [customUrlInput, setCustomUrlInput] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState(
        inputFeedback.NOTHING,
    )
    const [feedbackMessageType, setFeedbackMessageType] = useState(
        inputFeedbackType.CLEAR,
    )

    const { documentId } = useParams<{ documentId: string }>()
    const [currentDoc, setCurrentDoc] = useState(documentId as string)

    const handleCustomUrlChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            if (event.currentTarget.value.match(/[^A-Za-z0-9_-]/g)) {
                event.currentTarget.value = event.currentTarget.value.replace(
                    /[^A-Za-z0-9_-]/g,
                    '',
                )
            }
            setCustomUrlInput(event.target.value)
            setFeedbackMessage(inputFeedback.NOTHING)
            setFeedbackMessageType(inputFeedbackType.CLEAR)
        },
        [],
    )

    const handleNewIdVisuals = useCallback(() => {
        setFeedbackMessageType(inputFeedbackType.SUCCESS)
        setFeedbackMessage(inputFeedback.ID_SET)
        setCurrentDoc(customUrlInput)
        history.replaceState({}, '', customUrlInput)
        setCustomUrlInput('')
    }, [customUrlInput])

    const handleFailedInputVisuals = useCallback((feedback: inputFeedback) => {
        setFeedbackMessageType(inputFeedbackType.FAILURE)
        setFeedbackMessage(feedback)
    }, [])

    const tryAddCustomUrl = useCallback(async () => {
        if (!customUrlInput) {
            handleFailedInputVisuals(inputFeedback.EMPTY_STRING)
            return
        } else if (customUrlInput.length < 6) {
            handleFailedInputVisuals(inputFeedback.TOO_SHORT)
            return
        }

        try {
            const isOwner = user?.uid && settings.owners.includes(user.uid)
            if (!isOwner) throw new Error()

            const successfulCopy = await copySettingsToNewId(
                customUrlInput,
                documentId ?? '',
            )
            if (successfulCopy) {
                updateFirebaseSettings(currentDoc, {
                    isScheduledForDelete: true,
                })
                handleNewIdVisuals()
            } else {
                handleFailedInputVisuals(inputFeedback.ID_UNAVAILABLE)
            }
        } catch {
            handleFailedInputVisuals(inputFeedback.NOT_OWNER)
        }
    }, [
        currentDoc,
        customUrlInput,
        documentId,
        handleNewIdVisuals,
        settings.owners,
        user?.uid,
        handleFailedInputVisuals,
    ])

    return (
        <div className={classes.CustomURL}>
            <Paragraph>
                Her kan du lage en selvbestemt lenke til tavla di. Dette gjør
                det både lettere for deg óg andre å ha tilgang til tavla di.
            </Paragraph>
            <Paragraph>
                <EmphasizedText>
                    Obs, den gamle Tavla-lenken din vil slettes hvis du setter
                    en ny.
                </EmphasizedText>
            </Paragraph>
            <Label>Krav til Tavla-lenke</Label>
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
            <div className={classes.InputArea}>
                <Paragraph margin="none">tavla.entur.no/t/</Paragraph>
                <div className={classes.InputField}>
                    <TextField
                        label="Ønsket lenkeadresse"
                        value={customUrlInput}
                        onChange={handleCustomUrlChange}
                        onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                            if (e.key === 'Enter') tryAddCustomUrl()
                        }}
                        maxLength={80}
                        variant={feedbackMessageType}
                        feedback={feedbackMessage}
                    />
                </div>
                <div>
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

export { CustomURL }
