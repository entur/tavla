import React from 'react'
import classNames from 'classnames'
import { Heading2 } from '@entur/typography'
import { Switch } from '@entur/form'
import classes from './EditTile.module.scss'

interface Props {
    className?: string
    children?: React.ReactNode
    title: React.ReactNode
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
    checked: boolean
}

const EditTile: React.FC<Props> = ({
    className,
    children,
    title,
    onChange,
    checked,
}) => (
    <div className={classNames(classes.EditTile, className)}>
        <div className={classes.Header}>
            <Heading2 className={classes.Heading}>{title}</Heading2>
            <Switch
                className={classes.Switch}
                onChange={onChange}
                checked={checked}
            />
        </div>
        {children}
    </div>
)

export { EditTile }
