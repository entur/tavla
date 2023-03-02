import React, { useCallback } from 'react'
import sikkerhetBom from 'assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from 'assets/images/sikkerhet_bom@2x.png'
import { deleteDocument } from 'settings/firebase'
import { CloseButton } from 'components/CloseButton'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useToast } from '@entur/alert'
import classes from '../AccountModals.module.scss'

function DeleteTavleModal({
    open,
    onDismiss,
    id,
}: {
    open: boolean
    onDismiss: () => void
    id: string
}) {
    const { addToast } = useToast()
    const handleDelete = useCallback(() => {
        deleteDocument(id)
        addToast({
            title: 'Avgangstavla ble slettet.',
            content:
                'Tavla ble slettet permanent og er dermed ikke lenger tilgjengelig.',
            variant: 'success',
        })
        onDismiss()
    }, [id, onDismiss, addToast])

    return (
        <Modal
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
            className={classes.Modal}
        >
            <CloseButton onClick={onDismiss} />
            <img
                src={sikkerhetBom}
                srcSet={`${retinaSikkerhetBom} 2x`}
                className={classes.Image}
            />
            <Heading3 margin="none">Slette avgangstavle?</Heading3>
            <Paragraph className={classes.Paragraph}>
                Er du sikker på at du vil slette denne tavla? Tavla vil være
                borte for godt og ikke mulig å finne tilbake til.
            </Paragraph>
            <GridContainer spacing="medium" className={classes.GridContainer}>
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={handleDelete}
                        className="modal-submit"
                    >
                        Ja, slett tavle for godt
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton
                        width="fluid"
                        type="submit"
                        onClick={onDismiss}
                    >
                        Avbryt
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export { DeleteTavleModal }
