import React from 'react'
import classNames from 'classnames'
import classes from './EditTile.module.scss'

interface Props {
    className?: string
    children: React.ReactNode
}

const EditTile: React.FC<Props> = ({ className, children }) => (
    <div className={classNames(classes.EditTile, className)}>{children}</div>
)

export { EditTile }
