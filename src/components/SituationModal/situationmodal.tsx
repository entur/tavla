import React from 'react'
import { Modal } from '@entur/modal'
import { PrimaryButton } from '@entur/button'

import { Paragraph } from '@entur/typography'

import ValidationExclamation from '../../assets/icons/ValidationExclamation'

interface Props {
    situationMessage: string
}

function SituationModal(props: Props): JSX.Element {
    const { situationMessage } = props
    const [isOpen, setOpen] = React.useState(false)

    return (
        <div onClick={() => setOpen(true)}>
            <ValidationExclamation />
            <div className="modal-container">
                <Modal
                    open={isOpen}
                    onDismiss={() => setOpen(false)}
                    title=""
                    size="extraSmall"
                    closeOnClickOutside={true}
                >
                    <Paragraph>{situationMessage + '.'}</Paragraph>
                    <PrimaryButton
                        onClick={() => setOpen(false)}
                        size="medium"
                        className="modal-container__button"
                    >
                        Lukk
                    </PrimaryButton>
                </Modal>
            </div>
        </div>
    )
}

export default SituationModal
