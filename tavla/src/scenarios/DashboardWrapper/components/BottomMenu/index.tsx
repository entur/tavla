import React, { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import { SettingsButton } from '../SettingsButton'
import { LockButton } from '../LockButton'
import { CopyButton } from '../CopyButton'
import { LogoutButton } from '../LogoutButton'
import { BoardsButton } from '../BoardsButton'
import classes from './BottomMenu.module.scss'

function BottomMenu(): JSX.Element {
    const [showMenu, setShowMenu] = useState(false)
    const [, setPreviousTimeout] = useState<NodeJS.Timeout>()

    const showMenuOnMouseMove = useCallback(() => {
        setShowMenu(true)

        const timeoutId = setTimeout(() => {
            // Hides menu after 1000ms
            setShowMenu(false)
        }, 1000)

        setPreviousTimeout((prev) => {
            // Resets timer when mouse is moved, menu is hidden 1000ms after mouse stops moving
            if (prev) clearTimeout(prev)
            return timeoutId
        })
    }, [])

    useEffect(() => {
        document.addEventListener('mousemove', showMenuOnMouseMove)
        document.addEventListener('keydown', showMenuOnMouseMove)

        return () => {
            document.removeEventListener('mousemove', showMenuOnMouseMove)
            document.removeEventListener('keydown', showMenuOnMouseMove)
        }
    }, [showMenuOnMouseMove])

    return (
        <div
            className={classNames(classes.BottomMenu, {
                [classes.HiddenMenu]: showMenu,
            })}
        >
            <SettingsButton />
            <LockButton />
            <CopyButton />
            <BoardsButton />
            <LogoutButton />
        </div>
    )
}

export { BottomMenu }
