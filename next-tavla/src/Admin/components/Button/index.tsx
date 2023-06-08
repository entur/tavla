import React from 'react'
import classNames from 'classnames'
import classes from './styles.module.css'

function TavlaButton({
    className,
    children,
    ...rest
}: React.HTMLAttributes<HTMLButtonElement>) {
    const cn = classNames(classes.button, className)
    return (
        <button className={cn} {...rest}>
            {children}
        </button>
    )
}

export { TavlaButton }
