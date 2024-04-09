import classes from './styles.module.css'
import { TWalkingDistance } from 'types/tile'
import { WalkingDistance } from '../WalkingDistance'

function TableHeader({
    heading,
    walkingDistance,
}: {
    heading: string
    walkingDistance?: TWalkingDistance
}) {
    return (
        <div className="flexRow justifyBetween alignCenter h-4 mb-1">
            <h1 className={classes.heading}>{heading}</h1>
            <WalkingDistance walkingDistance={walkingDistance} />
        </div>
    )
}

export { TableHeader }
