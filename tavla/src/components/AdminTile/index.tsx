import React from 'react'
import classNames from 'classnames'
import { Heading2 } from '@entur/typography'
import { Switch } from '@entur/form'
import classes from './AdminTile.module.scss'

function AdminTile({
    className,
    children,
    title,
    onChange,
    checked,
}: {
    className?: string
    children?: React.ReactNode
    title: React.ReactNode
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    checked: boolean
}) {
    return (
        <div className={classNames(classes.AdminTile, className)}>
            <div className={classes.Header}>
                <Heading2 className={classes.Heading}>{title}</Heading2>
                <Switch
                    className={classes.Switch}
                    onChange={onChange}
                    checked={checked}
                    size="large"
                />
            </div>
            {children}
        </div>
    )
}

export { AdminTile }
