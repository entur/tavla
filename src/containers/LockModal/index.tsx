import React, { useEffect } from 'react'

import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'

import Check from '../../assets/images/check.png'
import retinaCheck from '../../assets/images/check@2x.png'

import { useFirebaseAuthentication } from '../../auth'
import { useSettingsContext } from '../../settings'

import LoginModal from '../Admin/LoginModal'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton } from '@entur/button'

const LockModal = (): JSX.Element => {
    const user = useFirebaseAuthentication()

    const [{ owner }, { setOwner }] = useSettingsContext()

    useEffect(() => {
        if (user && !user.isAnonymous && owner !== user.uid) {
            setOwner(user.uid)
        }
    }, [owner, user, setOwner])

    if (user === undefined) {
        return null
    }

    if (!user || user.isAnonymous) {
        return <LoginModal />
    }

    return (
        <Modal
            onDismiss={() => false}
            size="small"
            title=""
            className="login-modal"
        >
            <div className="centered">
                <img src={Check} srcSet={`${retinaCheck} 2x`} />
            </div>
            <Heading3 margin="none">Tavla er låst til din konto</Heading3>
            <Paragraph>
                Fra nå av kan bare du redigere denne tavla. Hvis du ikke vil ha
                tavla lagret lenger, kan du slette den fra oversikten over dine
                tavler.
            </Paragraph>
            <GridContainer spacing="medium">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={() => false}
                        className="modal-submit"
                    >
                        Se avgangstavla
                    </PrimaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export default LockModal
