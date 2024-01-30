import { PrimaryButton, SecondarySquareButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Heading2, Paragraph } from '@entur/typography'
import Image from 'next/image'
import { TBoard } from 'types/settings'
import sheep from 'assets/illustrations/Sheep.png'
import { CloseIcon } from '@entur/icons'
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
            <SecondarySquareButton
                aria-label="Avbryt sletting"
                className="ml-auto"
                onClick={closeModal}
            >
                <CloseIcon />
            </SecondarySquareButton>
            <Image src={sheep} alt="" className="h-50 w-50" />
            <Heading2>Slett tavle?</Heading2>
            <Paragraph className="mb-4">
                {board?.meta?.title
                    ? `Er du sikker på at du vil slette tavlen "${board.meta.title}"? `
                    : 'Er du sikker på at du vil slette denne tavlen? '}
                Avgangstavlen vil være borte for godt og ikke mulig å finne
                tilbake til.
            </Paragraph>
            <PrimaryButton
                aria-label="Slett tavle"
                className="w-100"
                onClick={deleteHandler}
            >
                Ja, slett avgangstavle!
            </PrimaryButton>
        </Modal>
    )
}

export { DeleteModal }
