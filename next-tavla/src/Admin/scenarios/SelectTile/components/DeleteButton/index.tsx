import { useState } from 'react'
import { ButtonGroup, SecondaryButton } from '@entur/button'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { PrimaryButton, TertiaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { useSettingsDispatch } from 'Admin/utils/contexts'
import classes from './styles.module.css'

function DeleteButton({ uuid }: { uuid: string }) {
    const dispatch = useSettingsDispatch()
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <Modal
                open={isOpen}
                onDismiss={() => setOpen(false)}
                size="small"
                align="center"
            >
                <Paragraph>
                    Er du sikker på at du vil slette denne holdeplassen?
                </Paragraph>
                <ButtonGroup>
                    <SecondaryButton onClick={() => setOpen(false)}>
                        Avbryt
                    </SecondaryButton>
                    <PrimaryButton
                        onClick={() => {
                            setOpen(false)
                            dispatch({
                                type: 'removeTile',
                                tileId: uuid,
                            })
                        }}
                    >
                        Ja, slett
                    </PrimaryButton>
                </ButtonGroup>
            </Modal>

            <TertiaryButton
                onClick={() => setOpen(true)}
                className={classes.deleteButton}
            >
                <div className={classes.deleteButtonContent}>
                    <DeleteIcon size={16} />
                    Slett
                </div>
            </TertiaryButton>
        </>
    )
}

export { DeleteButton }
