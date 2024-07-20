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
        'h-full w-full text-primary bg-secondary p-em-1 rounded overflow-hidden',
        className,
      )}
      style={{
        overflow: 'auto',
        maxHeight: '100vh'
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export { Tile }
