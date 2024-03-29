import React, { useCallback, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useUser } from 'settings/UserProvider'
import { useSettings } from 'settings/SettingsProvider'
import sikkerhetBom from 'assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from 'assets/images/sikkerhet_bom@2x.png'
import { CloseButton } from 'components/CloseButton'
import { LoginCase } from 'src/types'
import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import classes from './Modals.module.scss'
import { LoginModal } from './LoginModal'

function MineTavlerModal({
    open,
    onDismiss,
}: {
    open: boolean
    onDismiss: () => void
}) {
    const navigate = useNavigate()
    const user = useUser()
    const [settings, setSettings] = useSettings()
    const { documentId } = useParams<{ documentId: string }>()

    const isLocked = user && !user.isAnonymous && settings.owners.length && open

    useEffect(() => {
        if (isLocked) {
            navigate('/tavler')
        }
    }, [isLocked, navigate])

    const handleLockingTavle = useCallback(
        (lock: boolean): void => {
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
        },
        [navigate, open, setSettings, settings, user],
    )

    if (user === undefined || isLocked) {
        return null
    }

    if (!user || user.isAnonymous) {
        return (
            <LoginModal
                open={open}
                onDismiss={onDismiss}
                loginCase={LoginCase.mytables}
            />
        )
    }

    if (user && !user.isAnonymous && !documentId && open) {
        navigate('/tavler')
        return null
    }

    return (
        <Modal
            className={classes.Modal}
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
        >
            <CloseButton onClick={onDismiss} />
            <img
                src={sikkerhetBom}
                srcSet={`${retinaSikkerhetBom} 2x`}
                className={classes.Image}
            />
            <Heading3 margin="none">Vil du låse tavla først?</Heading3>
            <Paragraph className={classes.Paragraph}>
                Denne avgangstavla er ulåst. Hvis du vil lagre den til senere og
                gjøre så bare du kan redigere den, bør du først låse den til din
                konto.
            </Paragraph>
            <GridContainer spacing="medium" className={classes.GridContainer}>
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => handleLockingTavle(true)}
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

export { MineTavlerModal }
