import { useState } from 'react'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'
import { TBoardID } from 'types/settings'

function DeleteBoardButton({
    boardId,
    boardName,
}: {
    boardId: TBoardID
    boardName?: string
}) {
    const [showModal, setShowModal] = useState(false)

    const { addToast } = useToast()

    const closeModal = () => {
        setShowModal(false)
    }

    const deleteBoardHandler = async () => {
        closeModal()
        addToast({
            title: `Tavle ${boardId} slettet!`,
            content: `${boardName ?? 'Tavla'} er slettet!`,
            variant: 'info',
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
