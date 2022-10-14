import React, { useCallback } from 'react'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useToast } from '@entur/alert'
import sikkerhetBom from '../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../assets/images/sikkerhet_bom@2x.png'
import { removeFromOwners } from '../../settings/FirestoreStorage'
import { CloseButton } from '../CloseButton/CloseButton'
import './OverflowModals.scss'

interface RemoveLockModalProps {
    open: boolean
    onDismiss: () => void
    id: string
    uid: string
}

const RemoveLockModal: React.FC<RemoveLockModalProps> = ({
    open,
    onDismiss,
    id,
    uid,
}) => {
    const { addToast } = useToast()
    const handleRemoveLockedTavle = useCallback(async () => {
        await removeFromOwners(id, uid)
        addToast({
            title: 'Tavla ble fjernet fra din konto.',
            content:
                'Avgangstavla er ikke lenger låst til din konto. Den eksisterer fortsatt og er fra nå tilgjengelig for andre å redigere.',
            variant: 'success',
        })
        onDismiss()
    }, [id, uid, onDismiss, addToast])

    return (
        <Modal
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
            className="overflow-modal"
        >
            <CloseButton onClick={onDismiss} />
            <div className="centered">
                <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
            </div>
            <Heading3 margin="none">Låse opp avgangstavle?</Heading3>
            <Paragraph>
                Er du sikker på at du vil låse opp denne tavla? Tavla vil
                fortsatt eksistere, men ikke lenger være knyttet til din konto
                eller vises i oversikten på Mine Tavler.
            </Paragraph>
            <GridContainer spacing="medium">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={handleRemoveLockedTavle}
                        className="modal-submit"
                    >
                        Ja, lås opp tavla
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

export { RemoveLockModal }
