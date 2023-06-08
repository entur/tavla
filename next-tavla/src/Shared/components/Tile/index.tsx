import classNames from 'classnames'
import classes from './styles.module.css'
import { forwardRef } from 'react'

const Tile = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
    function Tile({ className, children, ...rest }, ref) {
        const cn = classNames(classes.tile, className)
        return (
            <div className={cn} ref={ref} {...rest}>
                {children}
            </div>
        )
    },
)

export { Tile }
