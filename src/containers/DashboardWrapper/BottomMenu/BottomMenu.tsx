import React, { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import copy from 'copy-to-clipboard'
import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useWindowWidth } from '@react-hook/window-size'
import {
    ConfigurationIcon,
    CopyIcon,
    LogOutIcon,
    OpenedLockIcon,
    UserIcon,
} from '@entur/icons'
import { useToast } from '@entur/alert'
import { useSettings } from '../../../settings/SettingsProvider'
import { auth, useUser } from '../../../UserProvider'
import { LockModal } from '../../../components/Modals/LockModal/LockModal'
import { LoginModal } from '../../../components/Modals/LoginModal/LoginModal'
import { LoginCase } from '../../../components/Modals/LoginModal/login-modal-types'
import { MineTavlerModal } from '../../../components/Modals/MineTavlerModal/MineTavlerModal'
import { MenuButton } from './MenuButton/MenuButton'
import './BottomMenu.scss'

function BottomMenu({ className }: Props): JSX.Element {
    const URL = document.location.href
    const navigate = useNavigate()

    const user = useUser()
    const width = useWindowWidth()
    const [settings] = useSettings()
    const [menuHiddenByScroll, setMenuHiddenByScroll] = useState(false)
    const [isMobileWidth, setIsMobileWidth] = useState<boolean>(
        document.body.clientWidth <= 900,
    )

    const [lockModalOpen, setLockModalOpen] = useState<boolean>(false)
    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)
    const [mineTavlerModalOpen, setMineTavlerModalOpen] =
        useState<boolean>(false)

    const { addToast } = useToast()

    const { documentId } = useParams<{ documentId: string }>()

    const menuRef = useRef<HTMLDivElement>(null)

    const onSettingsButtonClick = useCallback(
        (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            if (documentId) {
                navigate(`/admin/${documentId}`)
            } else {
                const path = window.location.pathname.split('@')[1]
                navigate(`/admin/@${path}`)
                event.preventDefault()
            }
        },
        [navigate, documentId],
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
            title="Kopier lenke"
            icon={<CopyIcon size={21} />}
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
                    signOut(auth)
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

    useEffect(() => {
        setIsMobileWidth(width < 900)
    }, [width])

    useEffect(() => {
        if (menuRef.current && !isMobileWidth) {
            menuRef.current.classList.remove('hidden-menu')
        }
    }, [isMobileWidth])

    useScrollPosition(
        ({ prevPos, currPos }) => {
            if (!isMobileWidth) return
            if (!menuRef.current) return

            const hasScrolledDown = currPos.y < prevPos.y
            if (!menuHiddenByScroll && hasScrolledDown) {
                menuRef.current.classList.add('hidden-menu')
                setMenuHiddenByScroll(true)
            } else if (menuHiddenByScroll && !hasScrolledDown) {
                menuRef.current.classList.remove('hidden-menu')
                setMenuHiddenByScroll(false)
            }
        },
        [menuHiddenByScroll, isMobileWidth, setMenuHiddenByScroll],
    )

    const [idle, setIdle] = useState<boolean>(false)
    useEffect(() => {
        if (isMobileWidth) return
        const createTimeout = (): number =>
            window.setTimeout(() => {
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
    }, [idle, isMobileWidth, setIdle])

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
                loginCase={LoginCase.default}
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
}

export { BottomMenu }
