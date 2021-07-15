import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import copy from 'copy-to-clipboard'
import firebase from 'firebase/app'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useWindowWidth } from '@react-hook/window-size'

import {
    ConfigurationIcon,
    OpenedLockIcon,
    LogOutIcon,
    UserIcon,
    ShareIcon,
} from '@entur/icons'
import { useToast } from '@entur/alert'

import { useSettingsContext } from '../../../settings'
import { useFirebaseAuthentication } from '../../../auth'

import LockModal from '../../LockModal'
import LoginModal from '../../../components/LoginModal'
import MineTavlerModal from '../../MineTavlerModal'

import MenuButton from './MenuButton'
import './styles.scss'

function isMobileWeb(): boolean {
    return (
        typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1
    )
}

function BottomMenu({ className, history }: Props): JSX.Element {
    const URL = document.location.href

    const user = useFirebaseAuthentication()

    const [settings] = useSettingsContext()

    const [lockModalOpen, setLockModalOpen] = useState<boolean>(false)
    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
    const [mineTavlerModalOpen, setMineTavlerModalOpen] =
        useState<boolean>(false)

    const { addToast } = useToast()

    const { documentId } = useParams()

    const onSettingsButtonClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
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

    const lockingButton = settings &&
        !settings.owners?.length &&
        documentId && (
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

    const shareButton = (
        <MenuButton
            title="Del tavle"
            icon={<ShareIcon size={21} />}
            callback={(): void => {
                copy(URL)
                addToast({
                    title: 'Kopiert',
                    content:
                        'Linken har nå blitt kopiert til din utklippstavle.',
                    variant: 'success',
                })
            }}
        />
    )

    const logoutButton =
        documentId &&
        (user && !user.isAnonymous ? (
            <MenuButton
                title="Logg ut"
                icon={<LogOutIcon size={21} />}
                callback={(): void => {
                    addToast({
                        title: 'Logget ut',
                        content: 'Du er nå logget ut av din konto.',
                        variant: 'success',
                    })
                    firebase.auth().signOut()
                }}
            />
        ) : null)

    const tablesButton = (
        <MenuButton
            title="Mine tavler"
            icon={<UserIcon size={21} />}
            callback={(): void => setMineTavlerModalOpen(true)}
        />
    )

    const editButton = (!settings?.owners?.length ||
        (user && settings.owners?.includes(user.uid))) && (
        <MenuButton
            title="Rediger"
            icon={<ConfigurationIcon size={21} />}
            callback={onSettingsButtonClick}
        />
    )

    const menuRef = useRef<HTMLDivElement>(null)

    const [mobileWidth, setMobileWidth] = useState<boolean>(
        document.body.clientWidth <= 900,
    )
    const width = useWindowWidth()
    useEffect(() => {
        if (width > 900 && mobileWidth) {
            setMobileWidth(false)
            if (menuRef.current) {
                menuRef.current.classList.remove('hidden-menu')
            }
        } else if (width <= 900 && !mobileWidth) {
            setMobileWidth(true)
            if (menuRef.current) {
                menuRef.current.classList.add('hidden-menu')
            }
        }
    }, [width, mobileWidth, setMobileWidth])

    const isWeb = !isMobileWeb()
    const [hideOnScroll, setHideOnScroll] = useState(true)
    useScrollPosition(
        ({ prevPos, currPos }) => {
            if (!mobileWidth) return
            const isShow = currPos.y < prevPos.y
            const menu = menuRef.current
            if (isShow !== hideOnScroll && isWeb) {
                setHideOnScroll(isShow)
                if (!menu) return
                if (isShow) {
                    menu.classList.add('hidden-menu')
                } else {
                    menu.classList.remove('hidden-menu')
                }
            }
        },
        [hideOnScroll, mobileWidth, setHideOnScroll],
    )

    const [idle, setIdle] = useState<boolean>(false)
    useEffect(() => {
        if (mobileWidth) return
        const createTimeout = (): number => {
            return window.setTimeout(() => {
                if (
                    document
                        .getElementById('app')
                        ?.getAttribute('aria-hidden') == 'true'
                )
                    return
                setIdle(true)
                window.getSelection()?.removeAllRanges()
                const focusElement = document.activeElement as HTMLElement
                focusElement.blur()
                document.body.style.cursor = 'none'
            }, 2000)
        }
        let timeout = createTimeout()

        const removeTimeout = (): void => {
            clearTimeout(timeout)
        }

        const resetTimeout = (): void => {
            removeTimeout()
            timeout = createTimeout()
            setIdle(false)
            document.body.style.cursor = 'auto'
        }
        const handledResetTimeout = (): void => {
            if (!idle) return
            resetTimeout()
        }
        window.addEventListener('mousemove', handledResetTimeout)
        const menu = menuRef.current
        window.addEventListener('focusin', removeTimeout)
        window.addEventListener('focusout', resetTimeout)
        if (menu) {
            menu.addEventListener('mouseover', removeTimeout)
            menu.addEventListener('mouseout', resetTimeout)
        }

        return (): void => {
            window.removeEventListener('mousemove', handledResetTimeout)
            window.removeEventListener('focusin', removeTimeout)
            window.removeEventListener('focusout', resetTimeout)
            if (menu) {
                menu.removeEventListener('mouseover', removeTimeout)
                menu.removeEventListener('mouseout', resetTimeout)
            }
            clearTimeout(timeout)
        }
    }, [idle, mobileWidth, setIdle])

    return (
        <div
            ref={menuRef}
            className={`bottom-menu
                ${className || ''}
                ${idle ? 'hidden-menu' : ''}`}
        >
            <div className="bottom-menu__actions">
                {editButton}
                {lockingButton}
                {shareButton}
                {tablesButton}
                {logoutButton}
            </div>
            <LockModal
                open={lockModalOpen}
                onDismiss={(): void => setLockModalOpen(false)}
            />

            <LoginModal
                open={loginModalOpen}
                onDismiss={(): void => setLoginModalOpen(false)}
                loginCase="default"
            />

            <MineTavlerModal
                open={mineTavlerModalOpen}
                onDismiss={(): void => setMineTavlerModalOpen(false)}
            />
        </div>
    )
}

interface Props {
    className?: string
    history: any
}

export default BottomMenu
