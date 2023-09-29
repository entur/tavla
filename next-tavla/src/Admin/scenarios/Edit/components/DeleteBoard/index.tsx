import { useToggle } from 'hooks/useToggle'
import classes from './styles.module.css'
import { TBoardID } from 'types/settings'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import Link from 'next/link'

function DeleteBoard({ bid }: { bid?: TBoardID }) {
    const [isOpen, openModal, closeModal] = useToggle()

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
                    <PrimaryButton as={Link} href={`/api/delete/${bid}`}>
                        Ja, slett
                    </PrimaryButton>
                </div>
            </Modal>
        </>
    )
}

export { DeleteBoard }
