import React, { useCallback } from 'react'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { PrimaryButton } from '@entur/button'
import { useToast } from '@entur/alert'
import { GridContainer, GridItem } from '@entur/grid'
import retinaSikkerhetBom from '../../../assets/images/sikkerhet_bom@2x.png'
import sikkerhetBom from '../../../assets/images/sikkerhet_bom.png'
import { useSettings } from '../../../settings/SettingsProvider'
import { CloseButton } from '../../CloseButton/CloseButton'
import classes from '../AccountModals.module.scss'

interface NeedToBeOwnerModalProps {
    open: boolean
    onDismiss: (goToFirstTab?: boolean) => void
    uid: string | undefined
}

const NeedToBeOwnerModal: React.FC<NeedToBeOwnerModalProps> = ({
    open,
    onDismiss,
    uid,
}) => {
    const { addToast } = useToast()
    const [settings, setSettings] = useSettings()

    const handleAddOwnerToTavle = useCallback(() => {
        if (settings.owners && uid) {
            setSettings({
                owners: [...settings.owners, uid],
            })
            addToast({
                title: 'Tavla ble låst til din konto.',
                content:
                    'Nå som avgangstavla er låst til din konto kan kun du og de du velger å dele den med redigere den.',
                variant: 'success',
            })
        }
        onDismiss()
    }, [uid, settings, onDismiss, addToast, setSettings])

    return (
        <Modal
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
            className={classes.Modal}
        >
            <CloseButton onClick={() => onDismiss(true)} />
            <img
                src={sikkerhetBom}
                srcSet={`${retinaSikkerhetBom} 2x`}
                className={classes.Image}
            />
            <Heading3 margin="none">Kun eiere kan dele en tavle</Heading3>
            <Paragraph className={classes.Paragraph}>
                For å dele tavla må du være en eier av den. Lås tavla til din
                konto for å bli eier.
            </Paragraph>

            <GridContainer spacing="medium" className={classes.GridContainer}>
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={handleAddOwnerToTavle}
                        className="modal-submit"
                    >
                        Lås tavla til min konto
                    </PrimaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export { NeedToBeOwnerModal }
