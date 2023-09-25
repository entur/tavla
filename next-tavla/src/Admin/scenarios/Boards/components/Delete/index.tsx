import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import classes from './styles.module.css'
import { useToast } from '@entur/alert'
import { TBoard, TBoardID } from 'types/settings'
import { useBoardsSettingsDispatch } from '../../utils/context'
import { useToggle } from 'hooks/useToggle'
import { deleteBoard } from '../../utils/delete'

function DeleteBoardButton({ board }: { board: TBoard }) {
    const dispatch = useBoardsSettingsDispatch()
    const [showModal, openModal, closeModal] = useToggle()

    const { addToast } = useToast()

    const bid = board.id as TBoardID

    const deleteBoardHandler = async () => {
        closeModal()
        try {
            await deleteBoard(bid)
            dispatch({ type: 'deleteBoard', bid })
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
