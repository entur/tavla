import { IconButton, PrimaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading1, LeadParagraph } from '@entur/typography'
import Image from 'next/image'
import { TBoard } from 'types/settings'
import sheep from 'assets/illustrations/Sheep.png'
import { CloseIcon } from '@entur/icons'
import classes from './styles.module.css'
function DeleteModal({
    board,
    isOpen,
    closeModal,
    deleteHandler,
}: {
    board: TBoard
    isOpen: boolean
    closeModal: () => void
    deleteHandler: () => void
}) {
    return (
        <Modal
            open={isOpen}
            size="small"
            onDismiss={closeModal}
            closeLabel="Avbryt sletting"
            className="flexColumn justifyStart alignCenter textCenter"
        >
            <Image src={sheep} alt="" width={250} height={250} />
            <IconButton
                aria-label="Lukk dialog"
                className={classes.closeButton}
                onClick={closeModal}
            >
                <CloseIcon />
            </IconButton>
            <Heading1 className="text-rem-4">Slett tavle?</Heading1>
            <LeadParagraph>
                {board?.meta?.title
                    ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"? 
                    Avgangstavlen vil være borte for godt og ikke mulig å finne tilbake til.`
                    : 'Er du sikker på at du vil slette denne tavlen?'}
            </LeadParagraph>
            <PrimaryButton
                aria-label="Slett tavle"
                className={classes.deleteButton}
                onClick={deleteHandler}
            >
                Ja, slett avgangstavle!
            </PrimaryButton>
        </Modal>
    )
}

export { DeleteModal }
