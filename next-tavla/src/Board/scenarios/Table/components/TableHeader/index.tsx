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
        <div className="flex flex-row justify-between items-center mb-2 min-h-em-2">
            <h1 className="text-[1.5em] font-semibold m-0">{heading}</h1>
            <WalkingDistance walkingDistance={walkingDistance} />
        </div>
    )
}

export { TableHeader }
