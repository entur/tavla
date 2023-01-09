import React, { useState } from 'react'
import { SecondarySquareButton } from '@entur/button'
import { TextField } from '@entur/form'
import { AddIcon } from '@entur/icons'
import { Tooltip } from '@entur/tooltip'
import { addNewInviteToBoard } from '../../../../settings/firebase'
import { useUser } from '../../../../UserProvider'
import { BoardOwnersData, Invite } from '../../../../types'
import classes from '../ShareTab.module.scss'

const EMAIL_REGEX =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

enum inputFeedback {
    NOT_VALID_EMAIL = 'Ugyldig: Du har ikke skrevet en gyldig e-postadresse.',
    EMAIL_UNAVAILABLE = 'Ikke funnet: Ingen bruker med denne e-postadressen ble funnet.',
    OWN_EMAIL_ADDED = 'Du er allerede en eier av denne tavla.',
    AlREADY_ADDED = 'Denne brukeren er allerede lagt til.',
    UNKNOWN = 'En ukjent feil oppstod, venligst prøv igjen.',
    REQUEST_SENT = 'Forespørsel om eierskap i tavla ble sendt!',
    NOTHING = '',
}

enum inputFeedbackType {
    SUCCESS = 'success',
    FAILURE = 'error',
    CLEAR = 'info',
}

const AddNewOwnersInput = ({
    documentId,
    ownersData,
    invites,
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
        (owner: BoardOwnersData) => owner.email,
    )

    const onAddOwnerRequestToBoard = async () => {
        if (!newOwnerInput.match(EMAIL_REGEX)) {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            setInputFeedbackMessage(inputFeedback.NOT_VALID_EMAIL)
            return
        }

        if (
            owners.includes(newOwnerInput) ||
            invites.some((invite) => invite.receiver === newOwnerInput)
        ) {
            setInputFeedbackMessageType(inputFeedbackType.FAILURE)
            newOwnerInput === user?.email
                ? setInputFeedbackMessage(inputFeedback.OWN_EMAIL_ADDED)
                : setInputFeedbackMessage(inputFeedback.AlREADY_ADDED)
            return
        }

        if (user) {
            try {
                const success = await addNewInviteToBoard(
                    documentId,
                    newOwnerInput,
                    user.email ?? 'Ukjent',
                )
                if (success) {
                    setInputFeedbackMessageType(inputFeedbackType.SUCCESS)
                    setInputFeedbackMessage(inputFeedback.REQUEST_SENT)
                    setNewOwnerInput('')
                } else {
                    setInputFeedbackMessageType(inputFeedbackType.FAILURE)
                    setInputFeedbackMessage(inputFeedback.UNKNOWN)
                }
            } catch {
                throw new Error(
                    'Write error: could not add new owner request to board.',
                )
            }
        }
    }

    return (
        <div className={classes.InputArea}>
            <div className={classes.InputField}>
                <TextField
                    label="E-postadressen til brukeren"
                    value={newOwnerInput}
                    autoComplete="email"
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
            <div className={classes.SubmitButton}>
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
    invites: Invite[]
}

export { AddNewOwnersInput }
