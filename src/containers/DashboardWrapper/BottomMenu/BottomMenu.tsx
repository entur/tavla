import React, { useCallback, useEffect, useState } from 'react'
import classNames from 'classnames'
import classes from './BottomMenu.module.scss'
import { SettingsButton } from './buttons/SettingsButton'
import { LockButton } from './buttons/LockButton'
import { CopyButton } from './buttons/CopyButton'
import { LogoutButton } from './buttons/LogoutButton'
import { BoardsButton } from './buttons/BoardsButton'

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
            document.removeEventListener('keypress', showMenuOnMouseMove)
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
