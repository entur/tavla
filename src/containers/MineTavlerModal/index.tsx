import React from 'react'

import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'

import { useFirebaseAuthentication } from '../../auth'
import { useSettingsContext } from '../../settings'

import LoginModal from '../../components/LoginModal'

import sikkerhetBom from '../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../assets/images/sikkerhet_bom@2x.png'

import './styles.scss'

const MineTavlerModal = ({ open, onDismiss }: Props): JSX.Element => {
    const user = useFirebaseAuthentication()
    const [settings, { setOwners }] = useSettingsContext()

    if (user === undefined) {
        return null
    }

    if (user && !user.isAnonymous && settings.owners.length !== 0 && open) {
        onDismiss()
        window.location.href = `/tavler`
        return null
    }

    if (!user || user.isAnonymous) {
        return (
            <LoginModal
                open={open}
                onDismiss={onDismiss}
                loginCase="mytables"
            />
        )
    }

    const handleLockingTavle = (lock: boolean): void => {
        if (
            lock &&
            user &&
            !user.isAnonymous &&
            !settings.owners.includes(user.uid) &&
            open
        ) {
            const newOwnersList = [...settings.owners, user.uid]
            setOwners(newOwnersList)
            onDismiss()
            window.location.href = `/tavler`
        }
        onDismiss()
        window.location.href = `/tavler`
    }

    return (
        <Modal
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
            className="mine-tavler-modal"
        >
            <div className="centered">
                <img src={sikkerhetBom} srcSet={`${retinaSikkerhetBom} 2x`} />
            </div>
            <Heading3 margin="none">Vil du låse tavla først?</Heading3>
            <Paragraph>
                Denne avgangstavla er ulåst. Hvis du vil lagre den til senere og
                gjøre så bare du kan redigere den, bør du først låse den til din
                konto.
            </Paragraph>
            <GridContainer spacing="medium">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => handleLockingTavle(true)}
                        className="modal-submit"
                    >
                        Ja, lås tavla til min konto
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => handleLockingTavle(false)}
                    >
                        Fortsett uten å låse tavla
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export default MineTavlerModal

interface Props {
    open: boolean
    onDismiss: () => void
}
