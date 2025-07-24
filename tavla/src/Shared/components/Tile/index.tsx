import classNames from 'classnames'
import React from 'react'

function Tile({
    className,
    children,
    ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={classNames(
                'h-content w-full overflow-hidden rounded bg-secondary p-em-1 pt-em-0.25 text-primary',
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    )
}

export { Tile }
