import { useState } from 'react'
import { ButtonGroup } from '@entur/button'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { NegativeButton, PrimaryButton, TertiaryButton } from '@entur/button'
import { DeleteIcon } from '@entur/icons'
import { useSettingsDispatch } from 'Admin/utils/contexts'

function DeleteButton({ uuid }: { uuid: string }) {
    const dispatch = useSettingsDispatch()
    const [isOpen, setOpen] = useState(false)

    return (
        <>
            <Modal open={isOpen} onDismiss={() => setOpen(false)} size="medium">
                <Paragraph>
                    Er du sikker på at du vil slette denne holdeplassen?
                </Paragraph>
                <ButtonGroup>
                    <NegativeButton
                        onClick={() => {
                            setOpen(false)
                            dispatch({
                                type: 'removeTile',
                                tileId: uuid,
                            })
                        }}
                    >
                        Ja, slett
                    </NegativeButton>
                    <PrimaryButton onClick={() => setOpen(false)}>
                        Nei, behold
                    </PrimaryButton>
                </ButtonGroup>
            </Modal>

            <TertiaryButton onClick={() => setOpen(true)}>
                <DeleteIcon />
                {'Slett'}
            </TertiaryButton>
        </>
    )
}

export { DeleteButton }
