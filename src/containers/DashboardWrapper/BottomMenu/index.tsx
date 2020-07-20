import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import {
    ConfigurationIcon,
    OpenedLockIcon,
    LogOutIcon,
    UserIcon,
} from '@entur/icons'
import { useToast } from '@entur/alert'

import firebase from 'firebase'

import MenuButton from './MenuButton'

import { useSettingsContext } from '../../../settings'

import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useWindowWidth } from '@react-hook/window-size'

import './styles.scss'
import LockModal from '../../LockModal'
import LoginModal from '../../../components/LoginModal'
import { useFirebaseAuthentication } from '../../../auth'

function BottomMenu({ className, history }: Props): JSX.Element {
    const user = useFirebaseAuthentication()

    const [settings] = useSettingsContext()

    const [lockModalOpen, setLockModalOpen] = useState<boolean>(false)
    const [loginModalOpen, setLoginModalOpen] = useState<boolean>(false)

    const { addToast } = useToast()

    const { documentId } = useParams()

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

    const lockingButton = settings.owners.length === 0 && documentId && (
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
        ) : (
            <MenuButton
                title="Logg inn"
                icon={<UserIcon size={21} />}
                callback={(): void => setLoginModalOpen(true)}
            />
        ))

    const editButton = (settings.owners.length === 0 ||
        (user && settings.owners.includes(user.uid))) && (
        <MenuButton
            title="Rediger tavla"
            icon={<ConfigurationIcon size={21} />}
            callback={onSettingsButtonClick}
        />
    )

    const menuRef = useRef<HTMLDivElement>()

    const [mobileWidth, setMobileWidth] = useState<boolean>(
        document.body.clientWidth <= 900,
    )
    const width = useWindowWidth()
    useEffect(() => {
        if (width > 900 && mobileWidth) {
            setMobileWidth(false)
            menuRef.current.classList.remove('hidden-menu')
        } else if (width <= 900 && !mobileWidth) {
            setMobileWidth(true)
            menuRef.current.classList.add('hidden-menu')
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
                        .getAttribute('aria-hidden') == 'true'
                )
                    return
                setIdle(true)
                window.getSelection().removeAllRanges()
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
        menu.addEventListener('mouseover', removeTimeout)
        menu.addEventListener('mouseout', resetTimeout)

        return (): void => {
            window.removeEventListener('mousemove', handledResetTimeout)
            window.removeEventListener('focusin', removeTimeout)
            window.removeEventListener('focusout', resetTimeout)
            menu.removeEventListener('mouseover', removeTimeout)
            menu.removeEventListener('mouseout', resetTimeout)
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
                {logoutButton}
            </div>
            <LockModal
                open={lockModalOpen}
                onDismiss={(): void => setLockModalOpen(false)}
            />

            <LoginModal
                open={loginModalOpen}
                onDismiss={(): void => setLoginModalOpen(false)}
            />
        </div>
    )
}

interface Props {
    className?: string
    history: any
}

export default BottomMenu
