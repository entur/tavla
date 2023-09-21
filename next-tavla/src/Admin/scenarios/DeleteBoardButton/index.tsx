import { useState } from 'react'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'
import { TBoard, TBoardID } from 'types/settings'
import { useSettingsDispatch } from 'Admin/utils/boardsContexts'
import { deleteBoard } from 'hooks/useDeleteBoard'

function DeleteBoardButton({ board }: { board: TBoard }) {
    const dispatch = useSettingsDispatch()
    const [showModal, setShowModal] = useState(false)

    const { addToast } = useToast()

    const closeModal = () => {
        setShowModal(false)
    }

    const deleteBoardHandler = async () => {
        closeModal()
        try {
            await deleteBoard(board.id as TBoardID)
            dispatch({ type: 'deleteBoard', board })
            addToast({
                title: 'Tavle slettet!',
                content: `${board?.meta?.title ?? 'Tavla'} er slettet!`,
                variant: 'info',
            })
        } catch (error) {
            addToast({
                title: 'Noe gikk galt',
                content: 'Kunne ikke slette tavle',
                variant: 'info',
            })
        }
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
                    {board?.meta?.title
                        ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"?`
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
