import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { Heading3, Paragraph } from '@entur/typography'
import {
    EditIcon,
    ConfigurationIcon,
    CheckIcon,
    OpenedLockIcon,
    LogOutIcon,
    UserIcon,
} from '@entur/icons'
import { Modal } from '@entur/modal'
import { Button } from '@entur/button'
import { colors } from '@entur/tokens'
import { useToast } from '@entur/alert'

import firebase from 'firebase'

import MenuButton from './MenuButton'

import { useSettingsContext } from '../../../settings'

import { useScrollPosition } from '@n8tb1t/use-scroll-position'
import { useWindowWidth } from '@react-hook/window-size'

import './styles.scss'
import LockModal from '../../LockModal'
import LoginModal from '../../Admin/LoginModal/.'
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
                        content: 'Du er nå logget ut av din konto',
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
