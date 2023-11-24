import classNames from 'classnames'
import classes from './styles.module.css'
import { ReactNode } from 'react'

function Modal({
    open,
    close,
    size,
    children,
}: {
    open: boolean
    close: ReactNode
    size: 'small' | 'medium' | 'large'
    children: ReactNode
}) {
    if (!open) return null
    return (
        <div className={classes.modal}>
            <div className={classNames(classes.content, classes[size])}>
                <div className="flexRow justifyEnd">{close}</div>
                {children}
            </div>
        </div>
    )
}

export { Modal }
