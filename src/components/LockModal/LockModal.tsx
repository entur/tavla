import React, { useEffect } from 'react'
import { Heading3, Paragraph } from '@entur/typography'
import { Modal } from '@entur/modal'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton } from '@entur/button'
import Check from '../../assets/images/check.png'
import retinaCheck from '../../assets/images/check@2x.png'
import { useUser } from '../../UserProvider'
import { useSettings } from '../../settings/SettingsProvider'
import { CloseButton } from '../CloseButton/CloseButton'
import { LoginModal } from '../LoginModal/LoginModal'
import { LoginCase } from '../LoginModal/login-modal-types'
import classes from './LockModal.module.scss'

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
            className={classes.LockModal}
            size="small"
            open={open}
            title=""
            onDismiss={onDismiss}
        >
            <CloseButton onClick={onDismiss} />
            <div className={classes.Centered}>
                <img
                    className={classes.Image}
                    src={Check}
                    srcSet={`${retinaCheck} 2x`}
                />
            </div>
            <Heading3 className={classes.Heading} margin="none">
                Tavla er låst til din konto
            </Heading3>
            <Paragraph className={classes.Paragraph}>
                Fra nå av kan bare du redigere denne tavla. Hvis du ikke vil ha
                tavla lagret lenger, kan du slette den fra oversikten over dine
                tavler.
            </Paragraph>
            <GridContainer spacing="medium">
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
