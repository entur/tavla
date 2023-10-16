import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'
import { TBoard } from 'types/settings'
import { useOptimisticDeleteBoard } from '../../utils/context'
import { useToggle } from 'hooks/useToggle'

function DeleteBoardButton({ board }: { board: TBoard }) {
    const [showModal, openModal, closeModal] = useToggle()

    const deleteDispatch = useOptimisticDeleteBoard()

    const deleteBoardHandler = async () => {
        await deleteDispatch(board)
        closeModal()
    }

    return (
        <>
            <IconButton aria-label="Slett tavle" onClick={openModal}>
                <DeleteIcon />
            </IconButton>
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
        </>
    )
}

export { DeleteBoardButton }
