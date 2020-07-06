import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Heading3, Paragraph } from '@entur/typography'
import {
    EditIcon,
    ConfigurationIcon,
    CheckIcon,
    OpenedLockIcon,
    LogOutIcon,
} from '@entur/icons'
import { Modal } from '@entur/modal'
import { Button } from '@entur/button'
import { colors } from '@entur/tokens'

import firebase from 'firebase'

import MenuButton from './MenuButton'

import { useSettingsContext } from '../../../settings'

import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useWindowWidth } from '@react-hook/window-size'

import './styles.scss'
import LockModal from '../../LockModal'
import { useFirebaseAuthentication } from '../../../auth'

interface RadioBoxProps {
    value: string
    selected: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    children: JSX.Element | JSX.Element[]
}

function RadioBox({
    value,
    selected,
    onChange,
    children,
}: RadioBoxProps): JSX.Element {
    const id = `radio-${value}`

    return (
        <label
            className={`radiobox ${selected ? 'radiobox--checked' : ''}`}
            htmlFor={id}
        >
            <div
                className={`radiobox__checkmark ${
                    selected ? 'radiobox__checkmark--checked' : ''
                }`}
            >
                {selected ? (
                    <CheckIcon color={colors.brand.blue} size="extra-large" />
                ) : null}
            </div>
            <input
                id={id}
                type="radio"
                value={value}
                onChange={onChange}
                checked={selected}
            />
            <div className="radiobox__children">{children}</div>
        </label>
    )
}

function BottomMenu({ className, history }: Props): JSX.Element {
    const user = useFirebaseAuthentication()

    const [settings, { setDashboard }] = useSettingsContext()

    const [modalOpen, setModalOpen] = useState<boolean>(false)
    const [lockModalOpen, setLockModalOpen] = useState<boolean>(false)
    const [choice, setChoice] = useState<string>(settings.dashboard || '')

    const { documentId } = useParams()

    const displayLockingOrLogoutButton = (): JSX.Element | null => {
        if (!settings.owner) {
            return (
                <MenuButton
                    title="Lås tavle"
                    icon={<OpenedLockIcon size={21} />}
                    callback={(): void => setLockModalOpen(true)}
                    tooltip={
                        <>
                            Lås tavla til en konto slik <br />
                            at bare du kan redigere den.
                        </>
                    }
                />
            )
        } else if (user && !user.isAnonymous) {
            return (
                <MenuButton
                    title="Logg ut"
                    icon={<LogOutIcon size={21} />}
                    callback={(): Promise<void> => firebase.auth().signOut()}
                />
            )
        } else {
            return null
        }
    }

    const onSettingsButtonClick = useCallback(
        (event) => {
            if (documentId) {
                history.push(`/admin/${documentId}`)
            } else {
                const path = window.location.pathname.split('@')[1]
                history.push(`/admin/@${path}`)
                event.preventDefault()
            }
        },
        [history, documentId],
    )

    const onChange = useCallback(
        (event: React.ChangeEvent<HTMLInputElement>) => {
            event.preventDefault()
            setChoice(event.target.value)
        },
        [],
    )

    const submit = useCallback(
        (event) => {
            event.preventDefault()
            setModalOpen(false)
            setDashboard(choice)
        },
        [choice, setDashboard],
    )

    const menuRef = useRef<HTMLDivElement>()

    const [mobileWidth, setMobileWidth] = useState<boolean>(
        document.body.clientWidth <= 900,
    )
    const width = useWindowWidth()
    useEffect(() => {
        if (width > 900 && mobileWidth) {
            setMobileWidth(false)
            menuRef.current.style.transform = ''
        } else if (width <= 900 && !mobileWidth) {
            setMobileWidth(true)
            menuRef.current.style.transform = 'translate(0%, 0%)'
        }
    }, [width, mobileWidth, setMobileWidth])

    const [hideOnScroll, setHideOnScroll] = useState(true)
    useScrollPosition(
        ({ prevPos, currPos }) => {
            if (!mobileWidth) return
            const isShow = currPos.y < prevPos.y
            const menu = menuRef.current
            if (isShow !== hideOnScroll) {
                setHideOnScroll(isShow)
                if (isShow) {
                    menu.style.transform = 'translate(0%, 100%)'
                    menu.style.transition = 'transform 0,3s ease-out'
                } else {
                    menu.style.transform = 'translate(0%, 0%)'
                    menu.style.transition = 'transform 0,3s ease-in'
                }
            }
        },
        [hideOnScroll, mobileWidth, setHideOnScroll],
    )

    return (
        <div ref={menuRef} className={`bottom-menu ${className || ''}`}>
            <div className="bottom-menu__actions">
                <MenuButton
                    title="Endre visning"
                    icon={<EditIcon size={21} />}
                    callback={(): void => setModalOpen(true)}
                />
                <MenuButton
                    title="Rediger tavla"
                    icon={<ConfigurationIcon size={21} />}
                    callback={onSettingsButtonClick}
                />
                {displayLockingOrLogoutButton()}
            </div>

            <Modal
                size="small"
                open={modalOpen}
                title="Endre visning"
                onDismiss={(): void => setModalOpen(false)}
            >
                <Paragraph>Velg visningen du ønsker for Tavla.</Paragraph>
                <form onSubmit={submit}>
                    <RadioBox
                        value=""
                        selected={choice === ''}
                        onChange={onChange}
                    >
                        <Heading3 margin="none">Kompakt</Heading3>
                        <Paragraph>
                            De tre neste avgangene til en linje vises på samme
                            rad.
                        </Paragraph>
                    </RadioBox>
                    <RadioBox
                        value="Chrono"
                        selected={choice === 'Chrono'}
                        onChange={onChange}
                    >
                        <Heading3 margin="none">Kronologisk</Heading3>
                        <Paragraph>Hver avgang vises på en egen rad.</Paragraph>
                    </RadioBox>
                    <RadioBox
                        value="Timeline"
                        selected={choice === 'Timeline'}
                        onChange={onChange}
                    >
                        <Heading3 margin="none">Tidslinja</Heading3>
                        <Paragraph>
                            En visuell fremvisning der avgangene beveger seg mot
                            stoppet. Ikke egnet for bysykkel.
                        </Paragraph>
                    </RadioBox>
                    <div className="bottom-menu-modal__buttons">
                        <Button
                            variant="secondary"
                            type="button"
                            onClick={(): void => setModalOpen(false)}
                        >
                            Avbryt
                        </Button>
                        <Button variant="primary" type="submit">
                            Lagre valg
                        </Button>
                    </div>
                </form>
            </Modal>

            <LockModal
                open={lockModalOpen}
                onDismiss={(): void => setLockModalOpen(false)}
            />
        </div>
    )
}

interface Props {
    className?: string
    history: any
    onSettingsButtonClick: any
}

export default BottomMenu
