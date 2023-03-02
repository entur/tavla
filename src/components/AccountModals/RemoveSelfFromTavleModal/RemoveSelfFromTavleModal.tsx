import React, { useCallback } from 'react'
import sikkerhetBom from 'assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from 'assets/images/sikkerhet_bom@2x.png'
import { removeFromFirebaseArray } from 'settings/firebase'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useToast } from '@entur/alert'
import { CloseButton } from '../../CloseButton'
import classes from '../AccountModals.module.scss'

function RemoveSelfFromTavleModal({
    open,
    onDismiss,
    id,
    uid,
    forceRefresh = false,
}: {
    open: boolean
    onDismiss: () => void
    id: string
    uid: string
    forceRefresh?: boolean
}) {
    const { addToast } = useToast()

    const handleRemoveSelfFromTavle = useCallback(async () => {
        await removeFromFirebaseArray(id, 'owners', uid)
        addToast({
            title: 'Du ble fjernet fra tavla.',
            content:
                'Du er ikke lenger en eier av denne tavla og vil ikke ha mulighet til å gjøre endringer i den.',
            variant: 'success',
        })
        if (forceRefresh) window.location.reload()
        onDismiss()
    }, [id, uid, forceRefresh, onDismiss, addToast])

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
            <Heading3 margin="none">Forlate avgangstavle?</Heading3>
            <Paragraph className={classes.Paragraph}>
                Er du sikker på at du vil forlate denne tavla? Tilgangen for
                andre tavla eventuelt er delt med vil ikke endres, men du selv
                vil ikke lenger ha mulighet til å gjøre endringer i den.
            </Paragraph>
            <GridContainer spacing="medium" className={classes.GridContainer}>
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={handleRemoveSelfFromTavle}
                        className="modal-submit"
                    >
                        Ja, fjern meg fra tavla
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

export { RemoveSelfFromTavleModal }
