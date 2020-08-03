import React, { useCallback } from 'react'

import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useToast } from '@entur/alert'

import CloseButton from '../../../../../components/LoginModal/CloseButton/CloseButton'

import sikkerhetBom from '../../../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../../../assets/images/sikkerhet_bom@2x.png'

import { removeFromOwners } from '../../../../../settings/FirestoreStorage'

import './styles.scss'

const RemoveLockModal = ({ open, onDismiss, id, uid }: Props): JSX.Element => {
    const { addToast } = useToast()
    const overflowRemoveLockedTavle = useCallback(
        (remove: boolean) => {
            if (remove) {
                removeFromOwners(id, uid)
                addToast({
                    title: 'Tavla ble fjernet fra din konto.',
                    content:
                        'Avgangstavla er ikke lenger låst til din konto. Den eksisterer fortsatt og er fra nå tilgjengelig for andre å redigere.',
                    variant: 'success',
                })
            }
            onDismiss()
        },
        [id, uid, onDismiss, addToast],
    )

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
                Er du sikker på at du vil fjerne denne tavla fra din konto?
                Tavla vil fortsatt eksistere, men ikke lenger være knyttet til
                din konto eller vises i oversikten på Mine Tavler.
            </Paragraph>
            <GridContainer spacing="medium">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => overflowRemoveLockedTavle(true)}
                        className="modal-submit"
                    >
                        Ja, fjern tavla fra min konto
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => overflowRemoveLockedTavle(false)}
                    >
                        Avbryt
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export default RemoveLockModal

interface Props {
    open: boolean
    onDismiss: () => void
    id: string
    uid: string
}
