import React, { useEffect } from 'react'
import Check from 'assets/images/check.png'
import retinaCheck from 'assets/images/check@2x.png'
import { useUser } from 'src/UserProvider'
import { useSettings } from 'settings/SettingsProvider'
import { Heading3, Paragraph } from '@entur/typography'
import { Modal } from '@entur/modal'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton } from '@entur/button'
import { CloseButton } from '../../CloseButton/CloseButton'
import { LoginModal } from '../LoginModal/LoginModal'
import { LoginCase } from '../LoginModal/login-modal-types'
import classes from '../AccountModals.module.scss'

interface LockModalProps {
    open: boolean
    onDismiss: () => void
}

const LockModal: React.FC<LockModalProps> = ({ open, onDismiss }) => {
    const user = useUser()
    const [settings, setSettings] = useSettings()

    useEffect(() => {
        if (
            user &&
            !user.isAnonymous &&
            !settings.owners.includes(user.uid) &&
            open
        ) {
            const newOwnersList = [...settings.owners, user.uid]
            setSettings({
                owners: newOwnersList,
            })
        }
    }, [settings, user, open, setSettings])

    if (user === undefined) {
        return null
    }

    if (!user || user.isAnonymous) {
        return (
            <LoginModal
                open={open}
                onDismiss={onDismiss}
                loginCase={LoginCase.lock}
            />
        )
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
                src={Check}
                srcSet={`${retinaCheck} 2x`}
                className={classes.Image}
            />
            <Heading3 margin="none">Tavla er låst til din konto</Heading3>
            <Paragraph className={classes.Paragraph}>
                Fra nå av kan bare du redigere denne tavla. Hvis du ikke vil ha
                tavla lagret lenger, kan du slette den fra oversikten over dine
                tavler.
            </Paragraph>
            <GridContainer spacing="medium" className={classes.GridContainer}>
                <GridItem small={12}>
                    <PrimaryButton
                        className={classes.SubmitButton}
                        width="fluid"
                        type="submit"
                        onClick={onDismiss}
                    >
                        Se avgangstavla
                    </PrimaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export { LockModal }
