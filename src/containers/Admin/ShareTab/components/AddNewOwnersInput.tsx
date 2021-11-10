import React, { useState } from 'react'

import { SecondarySquareButton } from '@entur/button'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'

import {
    getOwnerDataByEmail,
    updateSingleSettingsField,
} from '../../../../services/firebase'
import { useUser } from '../../../../auth'
import { BoardOwnersData, OwnerRequest } from '../../../../types'

enum inputFeedback {
    NOT_VALID_EMAIL = 'Ugyldig: Du har ikke skrevet en gyldig e-postadresse.',
    EMAIL_UNAVAILABLE = 'Ikke funnet: Ingen bruker med denne e-postadressen ble funnet.',
    OWN_EMAIL_ADDED = 'Du er allerede en eier av denne tavla.',
    AlREADY_ADDED = 'Denne brukeren er allerede lagt til.',
    REQUEST_SENT = 'Forespørsel om eierskap i tavla ble sendt!',
    NOTHING = '',
}

enum inputFeedbackType {
    SUCCESS = 'success',
    FAILURE = 'error',
    CLEAR = 'info',
}

export const AddNewOwnersInput = ({
    documentId,
    ownersData,
    requestedOwnersData,
    ownerRequests,
}: Props): JSX.Element => {
    const user = useUser()

    const [newOwnerInput, setNewOwnerInput] = useState<string>('')
    const [inputFeedbackMessage, setInputFeedbackMessage] = useState(
        inputFeedback.NOTHING,
    )
    const [inputFeedbackMessageType, setInputFeedbackMessageType] = useState(
        inputFeedbackType.CLEAR,
    )

    const owners: string[] = ownersData.map(
        (owner: BoardOwnersData) => owner.uid,
    )
    const ownerRequestRecipients: string[] = requestedOwnersData.map(
        (reqestedOwner: BoardOwnersData) => reqestedOwner.uid,
    )

    const EMAIL_REGEX =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const onAddOwnerRequestToBoard = async () => {
        if (!newOwnerInput.match(EMAIL_REGEX)) {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            setInputFeedbackMessage(inputFeedback.NOT_VALID_EMAIL)
            return
        }

        const uidResponse = await getOwnerDataByEmail(newOwnerInput)

        if (typeof uidResponse === 'string') {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            setInputFeedbackMessage(inputFeedback.EMAIL_UNAVAILABLE)
        } else {
            if (
                ownerRequestRecipients.includes(uidResponse.uid) ||
                owners.includes(uidResponse.uid)
            ) {
                setInputFeedbackMessageType(inputFeedbackType.FAILURE)
                if (uidResponse.uid === user?.uid) {
                    setInputFeedbackMessage(inputFeedback.OWN_EMAIL_ADDED)
                } else {
                    setInputFeedbackMessage(inputFeedback.AlREADY_ADDED)
                }
            } else if (user) {
                try {
                    await updateSingleSettingsField(
                        documentId,
                        'ownerRequestRecipients',
                        [...ownerRequestRecipients, uidResponse.uid],
                    )
                    await updateSingleSettingsField(
                        documentId,
                        'ownerRequests',
                        [
                            ...ownerRequests,
                            {
                                recipientUID: uidResponse.uid,
                                requestIssuerUID: user.uid,
                            },
                        ],
                    )
                } catch {
                    throw new Error(
                        'Write error: could not add new owner request to board.',
                    )
                }
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

interface Props {
    documentId: string
    ownersData: BoardOwnersData[]
    requestedOwnersData: BoardOwnersData[]
    ownerRequests: OwnerRequest[]
}

export default AddNewOwnersInput
