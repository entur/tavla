import React, { useCallback } from 'react'

import { Modal } from '@entur/modal'
import { Heading3, Paragraph } from '@entur/typography'
import { GridContainer, GridItem } from '@entur/grid'
import { PrimaryButton, SecondaryButton } from '@entur/button'
import { useToast } from '@entur/alert'

import CloseButton from './LoginModal/CloseButton/CloseButton'

import { useSettingsContext } from '../../settings'
import { removeFromOwners } from '../../settings/FirestoreStorage'
import { useUser } from '../../auth'

import sikkerhetBom from '../../assets/images/sikkerhet_bom.png'
import retinaSikkerhetBom from '../../assets/images/sikkerhet_bom@2x.png'

import './styles.scss'

const RemoveSelfFromTavleModal = ({
    open,
    onDismiss,
    id,
    uid,
    onMyBoards = false,
}: Props): JSX.Element => {
    const [settings, setSettings] = useSettingsContext()
    const { owners } = settings || {}
    const user = useUser()
    const { addToast } = useToast()
    const removeUserFromTavle = useCallback(
        (remove: boolean) => {
            if (remove) {
                if (onMyBoards) removeFromOwners(id, uid)
                else
                    setSettings({
                        owners: owners?.filter(
                            (ownerUID) => ownerUID != user?.uid,
                        ),
                    })
                addToast({
                    title: 'Du ble fjernet fra tavla.',
                    content:
                        'Du er ikke lenger en eier av denne tavla og vil ikke ha mulighet til å gjøre endringer i den.',
                    variant: 'success',
                })
            }
            onDismiss()
        },
        [owners, user?.uid, setSettings, onDismiss, addToast],
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
            <Heading3 margin="none">Forlate avgangstavle?</Heading3>
            <Paragraph>
                Er du sikker på at du vil forlate denne tavla? Tilgangen for
                andre tavla eventuelt er delt med vil ikke endres, men du selv
                vil ikke lenger ha mulighet til å gjøre endringer i den.
            </Paragraph>
            <GridContainer spacing="medium">
                <GridItem small={12}>
                    <PrimaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => removeUserFromTavle(true)}
                        className="modal-submit"
                    >
                        Ja, fjern meg fra tavlen
                    </PrimaryButton>
                </GridItem>
                <GridItem small={12}>
                    <SecondaryButton
                        width="fluid"
                        type="submit"
                        onClick={(): void => removeUserFromTavle(false)}
                    >
                        Avbryt
                    </SecondaryButton>
                </GridItem>
            </GridContainer>
        </Modal>
    )
}

export default RemoveSelfFromTavleModal

interface Props {
    open: boolean
    onDismiss: () => void
    id: string
    uid: string
    onMyBoards?: boolean
}
