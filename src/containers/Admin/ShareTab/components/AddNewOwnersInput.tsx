import React, { useState } from 'react'

import { SecondarySquareButton } from '@entur/button'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

import { useSettingsContext } from '../../../../settings'
import { getOwnerUIDByEmail } from '../../../../services/firebase'
import { useUser } from '../../../../auth'

enum inputFeedback {
    NOT_VALID_EMAIL = 'Ugyldig: Du har ikke skrevet en gylig e-postadresse.',
    EMAIL_UNAVAILABLE = 'Ikke funnet: Ingen bruker med denne e-postadressen ble funnet.',
    AlREADY_ADDED = 'Denne brukeren er allerede lagt til.',
    REQUEST_SENT = 'Forespørel om eierskap i tavla ble sendt!',
    NOTHING = '',
}

enum inputFeedbackType {
    SUCCESS = 'success',
    FAILURE = 'error',
    CLEAR = 'info',
}

export const AddNewOwnersInput = (): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const user = useUser()
    const [newOwnerInput, setNewOwnerInput] = useState<string>('')
    const [inputFeedbackMessage, setInputFeedbackMessage] = useState(
        inputFeedback.NOTHING,
    )
    const [inputFeedbackMessageType, setInputFeedbackMessageType] = useState(
        inputFeedbackType.CLEAR,
    )

    const EMAIL_REGEX =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const onAddOwnerRequestToBoard = async () => {
        if (!newOwnerInput.match(EMAIL_REGEX)) {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            setInputFeedbackMessage(inputFeedback.NOT_VALID_EMAIL)
            return
        }
        const uidResponse = await getOwnerUIDByEmail(newOwnerInput)
        if (typeof uidResponse === 'string') {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            setInputFeedbackMessage(inputFeedback.EMAIL_UNAVAILABLE)
        } else {
            if (
                settings?.ownerRequestRecipients.includes(uidResponse.uid) ||
                settings?.owners?.includes(uidResponse.uid)
            ) {
                setInputFeedbackMessageType(inputFeedbackType.FAILURE)
                setInputFeedbackMessage(inputFeedback.AlREADY_ADDED)
            } else if (user && settings) {
                setSettings({
                    ownerRequestRecipients: [
                        ...settings?.ownerRequestRecipients,
                        uidResponse.uid,
                    ],
                    ownerRequests: [
                        {
                            recipientUID: uidResponse.uid,
                            requestIssuerUID: user.uid,
                        },
                    ],
                })
                setInputFeedbackMessageType(inputFeedbackType.SUCCESS)
                setInputFeedbackMessage(inputFeedback.REQUEST_SENT)
                setNewOwnerInput('')
            }
        }
    }

    return (
        <div className="share-page__input-area">
            <div className="share-page__input-area__input-field">
                <TextField
                    label="E-postadressen til brukeren"
                    value={newOwnerInput}
                    onChange={(e) => {
                        setNewOwnerInput(e.currentTarget.value)
                        setInputFeedbackMessageType(inputFeedbackType.CLEAR)
                        setInputFeedbackMessage(inputFeedback.NOTHING)
                    }}
                    onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
                        if (e.key === 'Enter') onAddOwnerRequestToBoard()
                    }}
                    onBlur={() => {
                        setInputFeedbackMessageType(inputFeedbackType.CLEAR)
                        setInputFeedbackMessage(inputFeedback.NOTHING)
                    }}
                    maxLength={80}
                    variant={inputFeedbackMessageType}
                    feedback={inputFeedbackMessage}
                />
            </div>
            <div className="share-page__input-area__submit-button">
                <Tooltip content="Legg til eier" placement="top">
                    <SecondarySquareButton
                        onClick={onAddOwnerRequestToBoard}
                        aria-label="Legg til eier av tavla"
                    >
                        <AddIcon />
                    </SecondarySquareButton>
                </Tooltip>
            </div>
        </div>
    )
}

export default AddNewOwnersInput
