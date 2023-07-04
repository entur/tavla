import React from 'react'
import { Modal } from '@entur/modal'
import { Paragraph } from '@entur/typography'
import { PrimaryButton } from '@entur/button'

function TileDelete() {
    const [isOpen, setOpen] = React.useState(false)

    return (
        <>
            <Modal
                open={isOpen}
                onDismiss={() => setOpen(false)}
                title="Her er en modal"
                size="medium"
            >
                <Paragraph>
                    Modaler må kun vises etter en brukerinteraksjon, og skal
                    ikke avbryte brukeren på noe vis.
                </Paragraph>
                <PrimaryButton onClick={() => setOpen(false)}>
                    Lukk
                </PrimaryButton>
            </Modal>
            <PrimaryButton onClick={() => setOpen(true)} type="button">
                Vis en modal
            </PrimaryButton>
        </>
    )
}

export { TileDelete }
