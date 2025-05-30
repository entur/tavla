import classNames from 'classnames'
import React from 'react'

export function Tile({
    children,
    className,
    ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={classNames(
                'h-full w-full text-primary bg-secondary rounded overflow-hidden p-em-1',
                className,
            )}
            {...rest}
        >
            {children}
        </div>
    )
}
