import {
    PrimaryButton,
    SecondaryButton,
    SecondarySquareButton,
} from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { useState } from 'react'
import classes from './styles.module.css'
import { Tooltip } from '@entur/tooltip'
import { useEditSettingsDispatch } from 'Admin/scenarios/Edit/utils/contexts'

function DeleteTile({ uuid }: { uuid?: string }) {
    const dispatch = useEditSettingsDispatch()
    const [isOpen, setIsOpen] = useState(false)

    const closeModal = () => setIsOpen(false)
    const openModal = () => setIsOpen(true)
    const deleteTile = () => {
        closeModal()
        if (!uuid) return
        dispatch({ type: 'removeTile', tileId: uuid })
    }

    if (!uuid) return null

    return (
        <>
            <Modal
                open={isOpen}
                onDismiss={closeModal}
                size="small"
                align="center"
                title="Slett holdeplass"
            >
                <Paragraph>
                    Er du sikker på at du vil slette denne holdeplassen?
                </Paragraph>
                <div className={classes.deleteModal}>
                    <SecondaryButton onClick={closeModal}>
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton onClick={deleteTile}>
                        Ja, slett
                    </PrimaryButton>
                </div>
            </Modal>
            <Tooltip content="Slett holdeplass" placement="bottom">
                <SecondarySquareButton onClick={openModal}>
                    <DeleteIcon />
                </SecondarySquareButton>
            </Tooltip>
        </>
    )
}

export { DeleteTile }
