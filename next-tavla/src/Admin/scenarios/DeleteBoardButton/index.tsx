import { useState } from 'react'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'
import { deleteBoard } from 'utils/firebase'
import { useToast } from '@entur/alert'
import { useFeatureFlags } from 'hooks/useFeatureFlags'

function DeleteBoardButton({
    boardId,
    boardName,
}: {
    boardId: string
    boardName?: string
}) {
    const [showModal, setShowModal] = useState(false)

    const { addToast } = useToast()

    const DELETE_BOARD_ENABLED = useFeatureFlags('DELETE_BOARD')

    const closeModal = () => {
        setShowModal(false)
    }

    const deleteBoardHandler = async () => {
        if (!DELETE_BOARD_ENABLED) {
            console.log('dummy delete ', boardId)
            closeModal()
            return
        }
        deleteBoard('').then(() => {
            closeModal()
            addToast('Tavle slettet')
        })
    }

    return (
        <IconButton aria-label="Slett tavle" onClick={() => setShowModal(true)}>
            <Modal
                open={showModal}
                size="small"
                onDismiss={closeModal}
                closeLabel="Avbryt sletting"
                className={classes.deleteModal}
            >
                <Heading1>Slett tavle</Heading1>
                <LeadParagraph>
                    {boardName
                        ? `Er du sikker på at du vil slette tavlen "${boardName}"?`
                        : 'Er du sikker på at du vil slette denne tavlen?'}
                </LeadParagraph>
                <div className={classes.actions}>
                    <SecondaryButton
                        onClick={closeModal}
                        aria-label="Avbryt sletting"
                    >
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton
                        aria-label="Slett tavle"
                        onClick={deleteBoardHandler}
                    >
                        Ja, slett!
                    </PrimaryButton>
                </div>
            </Modal>
            <DeleteIcon />
        </IconButton>
    )
}

export { DeleteBoardButton }
