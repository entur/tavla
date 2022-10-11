import React, { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'

import { useUser } from '../../../auth'
import { useSettingsContext } from '../../../settings'

import { LoginModal } from '../LoginModal/LoginModal'
import { CloseButton } from '../LoginModal/CloseButton/CloseButton'

import sikkerhetBom from '../../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../../assets/images/sikkerhet_bom@2x.png'

import { getDocumentId } from '../../../utils'

import './MineTavlerModal.scss'

const MineTavlerModal = ({ open, onDismiss }: Props): JSX.Element | null => {
    const navigate = useNavigate()
    const user = useUser()
    const [settings, setSettings] = useSettingsContext()

    const isLocked =
        user && !user.isAnonymous && settings?.owners?.length && open

    useEffect(() => {
        if (isLocked) {
            navigate('/tavler')
        }
    }, [isLocked, navigate])

    if (user === undefined || isLocked) {
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

    if (user && !user.isAnonymous && !getDocumentId() && open) {
        navigate('/tavler')
        return null
    }

    const handleLockingTavle = (lock: boolean): void => {
        if (
            lock &&
            user &&
            !user.isAnonymous &&
            settings &&
            !settings.owners?.includes(user.uid) &&
            open
        ) {
            const newOwnersList = settings.owners
                ? [...settings.owners, user.uid]
                : [user.uid]
            setSettings({
                owners: newOwnersList,
            })
        }

        navigate('/tavler')
    }

    return (
        <Modal
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
            className="mine-tavler-modal"
        >
            <CloseButton onClick={onDismiss} />
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

interface Props {
    open: boolean
    onDismiss: () => void
}

export { MineTavlerModal }
