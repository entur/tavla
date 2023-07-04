import { useState } from 'react'
import classes from './styles.module.css'

import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { IconButton, PrimaryButton, SecondaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { useSettingsDispatch } from 'Admin/utils/contexts'

function TileDelete({ uuid }: { uuid: string }) {
    const dispatch = useSettingsDispatch()
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <Modal open={isOpen} onDismiss={() => setOpen(false)} size="medium">
                <Paragraph>
                    Er du sikker på at du vil slette denne holdeplassen?
                </Paragraph>

                <div className={classes.modalButton}>
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
                    <SecondaryButton onClick={() => setOpen(false)}>
                        Nei, behold
                    </SecondaryButton>
                </div>
            </Modal>

            <IconButton onClick={() => setOpen(true)}>
                <DeleteIcon />
                {'Slett'}
            </IconButton>
        </>
    )
}

export { TileDelete }
