import React, { useCallback } from 'react'

import { logEvent } from '@firebase/analytics'

import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { PrimaryButton } from '@entur/button'
import { useToast } from '@entur/alert'

import { GridContainer, GridItem } from '@entur/grid'

import retinaSikkerhetBom from '../../assets/images/sikkerhet_bom@2x.png'
import sikkerhetBom from '../../assets/images/sikkerhet_bom.png'
import { useSettingsContext } from '../../settings'
import { analytics } from '../../firebase-init'

import CloseButton from './LoginModal/CloseButton/CloseButton'

import './styles.scss'

const NeedToBeOwnerModal = ({ open, onDismiss, uid }: Props): JSX.Element => {
    const { addToast } = useToast()
    const [settings, setSettings] = useSettingsContext()

    const addOwnerToTavle = useCallback(
        (lock: boolean) => {
            if (lock && settings && settings.owners && uid) {
                setSettings({
                    owners: [...settings?.owners, uid],
                })
                logEvent(analytics, 'lock_board_to_account')
                addToast({
                    title: 'Tavla ble låst til din konto.',
                    content:
                        'Nå som avgangstavla er låst til din konto kan kun du og de du velger å dele den med redigere den.',
                    variant: 'success',
                })
            }
            onDismiss()
        },
        [uid, settings, onDismiss, addToast, setSettings],
    )

    return (
        <Modal
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
            className="overflow-modal"
        >
            <CloseButton onClick={() => onDismiss(true)} />
            <div className="centered">
                <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
            </div>
            <Heading3 margin="none">Kun eiere kan dele en tavle.</Heading3>
            <Paragraph>
                For å dele tavlen må du være en eier av den. Lås tavlen til din
                konto for å bli eier.
            </Paragraph>

            <GridContainer spacing="medium">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => addOwnerToTavle(true)}
                        className="modal-submit"
                    >
                        Lås tavlen til min konto
                    </PrimaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export default NeedToBeOwnerModal

interface Props {
    open: boolean
    onDismiss: (goToFirstTab?: boolean) => void
    uid: string | undefined
}
