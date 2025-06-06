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
                'h-full w-full overflow-hidden rounded bg-secondary p-em-1 text-primary',
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    )
}

export { Tile }
