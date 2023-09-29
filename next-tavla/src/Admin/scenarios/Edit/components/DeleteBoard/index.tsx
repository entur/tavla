import { useToast } from '@entur/alert'
import { TavlaError } from 'Admin/types/error'
import { useToggle } from 'hooks/useToggle'
import classes from './styles.module.css'
import { TBoardID, TUserID } from 'types/settings'
import { useRouter } from 'next/router'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { deleteBoard } from 'Admin/scenarios/Boards/utils/delete'

function DeleteBoard({ uid, bid }: { uid?: TUserID; bid?: TBoardID }) {
    const [isOpen, openModal, closeModal] = useToggle()
    const { addToast } = useToast()
    const router = useRouter()

    const removeBoard = async () => {
        closeModal()
        if (!bid)
            if (!bid)
                throw new TavlaError({
                    code: 'NOT_FOUND',
                    message: 'Board not found',
                })
        if (!uid)
            throw new TavlaError({
                code: 'NOT_FOUND',
                message: 'User not found',
            })
        try {
            await deleteBoard(bid)
            router.push('/edit/boards')
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
            <PrimaryButton onClick={openModal}>
                Slett tavle
                <DeleteIcon />
            </PrimaryButton>
            <Modal
                open={isOpen}
                onDismiss={closeModal}
                size="small"
                align="center"
                title="Slett tavle"
            >
                <Paragraph>
                    Er du sikker på at du vil slette denne tavlen?
                </Paragraph>
                <div className={classes.deleteModal}>
                    <SecondaryButton onClick={closeModal}>
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton onClick={removeBoard}>
                        Ja, slett
                    </PrimaryButton>
                </div>
            </Modal>
        </>
    )
}

export { DeleteBoard }
