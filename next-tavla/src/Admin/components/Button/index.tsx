import React from 'react'
import classNames from 'classnames'
import classes from './styles.module.css'

function TavlaButton({
    className,
    children,
    ...rest
}: React.HTMLAttributes<HTMLButtonElement>) {
    return (
        <button className={classNames(classes.button, className)} {...rest}>
            {children}
        </button>
    )
}

export { TavlaButton }
