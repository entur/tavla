import React, { useCallback } from 'react'

import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useToast } from '@entur/alert'

import CloseButton from '../../../../../components/LoginModal/CloseButton/CloseButton'

import sikkerhetBom from '../../../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../../../assets/images/sikkerhet_bom@2x.png'

import { deleteTavle } from '../../../../../settings/FirestoreStorage'

import './styles.scss'

const DeleteTavleModal = ({ open, onDismiss, id }: Props): JSX.Element => {
    const { addToast } = useToast()
    const overflowDeleteTavle = useCallback(
        (remove: boolean) => {
            if (remove) {
                deleteTavle(id)
                addToast({
                    title: 'Avgangstavla ble slettet.',
                    content:
                        'Tavla ble slettet permanent og er dermed ikke lenger tilgjengelig.',
                    variant: 'success',
                })
            }
            onDismiss()
        },
        [id, onDismiss, addToast],
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
            <Heading3 margin="none">Slette avgangstavle?</Heading3>
            <Paragraph>
                Er du sikker på at du vil slette denne tavla? Tavla vil være
                borte for godt og ikke mulig å finne tilbake til.
            </Paragraph>
            <GridContainer spacing="medium">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => overflowDeleteTavle(true)}
                        className="modal-submit"
                    >
                        Ja, slett tavle for godt
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => overflowDeleteTavle(false)}
                    >
                        Avbryt
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export default DeleteTavleModal

interface Props {
    open: boolean
    onDismiss: () => void
    id: string
}
