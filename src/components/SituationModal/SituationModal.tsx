import React from 'react'
import { Modal } from '@entur/modal'
import { PrimaryButton } from '@entur/button'
import { Paragraph } from '@entur/typography'
import { ValidationExclamation } from '../../assets/icons/ValidationExclamation'
import classes from './SituationModal.module.scss'

interface SituationModalProps {
    situationMessage: string
}

const SituationModal: React.FC<SituationModalProps> = ({
    situationMessage,
}) => {
    const [isOpen, setOpen] = React.useState<boolean>(false)

    return (
        <div onClick={() => setOpen(true)}>
            <ValidationExclamation />
            <Modal
                open={isOpen}
                onDismiss={() => setOpen(false)}
                title="Avviksmelding"
                size="medium"
                closeOnClickOutside={true}
                className={classes.SituationModal}
            >
                <Paragraph>{`${situationMessage}.`}</Paragraph>
                <PrimaryButton onClick={() => setOpen(false)} size="medium">
                    Lukk
                </PrimaryButton>
            </Modal>
        </div>
    )
}

export { SituationModal }
