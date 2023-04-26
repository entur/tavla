import React, { useCallback, useState } from 'react'
import {
    generatePath,
    useLocation,
    useNavigate,
    useParams,
} from 'react-router-dom'
import { copySettingsToNewId } from 'settings/firebase'
import {
    Label,
    Paragraph,
    EmphasizedText,
    UnorderedList,
    ListItem,
} from '@entur/typography'
import { TextField } from '@entur/form'
import type { VariantType } from '@entur/form'
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
    INVALID_STRING = 'Ugyldig navn: Lenken må bestå av karakterene a-z, A-Z, 0-9, _ eller -',
    NOTHING = '',
}

function isValidCustomURL(url: string): [boolean, inputFeedback] {
    const validInputRegex = /^[A-Za-z0-9_-]*$/g
    if (!url.match(validInputRegex)) {
        return [false, inputFeedback.INVALID_STRING]
    } else if (url.length === 0) {
        return [false, inputFeedback.EMPTY_STRING]
    } else if (url.length < 6) {
        return [false, inputFeedback.TOO_SHORT]
    } else {
        return [true, inputFeedback.NOTHING]
    }
}

async function setCustomURL(
    customUrl: string,
    currentUrl: string,
): Promise<[boolean, inputFeedback]> {
    const [isValid, feedback] = isValidCustomURL(customUrl)
    if (!isValid) return [false, feedback]

    try {
        const successfulCopy = await copySettingsToNewId(customUrl, currentUrl)

        if (successfulCopy) {
            return [true, inputFeedback.ID_SET]
        } else {
            return [false, inputFeedback.ID_UNAVAILABLE]
        }
    } catch {
        return [false, inputFeedback.NOT_OWNER]
    }
}

function CustomURL() {
    const { documentId } = useParams<{ documentId: string }>()
    const navigate = useNavigate()
    const location = useLocation()

    const [customUrlInput, setCustomUrlInput] = useState('')
    const [feedbackMessage, setFeedbackMessage] = useState<inputFeedback>(
        inputFeedback.NOTHING,
    )
    const [inputVariant, setInputVariant] = useState<VariantType | undefined>()

    const onUrlInputChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            const value = event.target.value
            const [isValid, feedback] = isValidCustomURL(value)

            setCustomUrlInput(value)
            setInputVariant(isValid ? undefined : 'error')
            setFeedbackMessage(feedback)
        },
        [],
    )

    const tryAddCustomUrl = useCallback(async () => {
        if (!documentId) return

        const [wasSuccessful, feedback] = await setCustomURL(
            customUrlInput,
            documentId,
        )

        setInputVariant(wasSuccessful ? 'success' : 'error')
        setFeedbackMessage(feedback)

        if (wasSuccessful) {
            const newPath = generatePath('/admin/:customUrlInput', {
                customUrlInput,
            })

            navigate(newPath + location.search, { replace: true })
        }
    }, [customUrlInput, documentId, location.search, navigate])

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
                        onChange={onUrlInputChange}
                        onKeyDown={(
                            e: React.KeyboardEvent<HTMLInputElement>,
                        ) => {
                            if (e.key === 'Enter') tryAddCustomUrl()
                        }}
                        maxLength={80}
                        variant={inputVariant}
                        feedback={feedbackMessage}
                    />
                </div>
                <div>
                    <Tooltip content="Sett Tavla-lenke" placement="top">
                        <SecondarySquareButton
                            onClick={tryAddCustomUrl}
                            aria-label="Sett Tavla-lenke"
                            disabled={!isValidCustomURL(customUrlInput)[0]}
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
