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
        <div className="mb-2 flex min-h-em-3 flex-row items-center justify-between">
            <h1 className="m-0 line-clamp-2 hyphens-auto text-em-xl font-semibold leading-em-base">
                {heading}
            </h1>
            <WalkingDistance walkingDistance={walkingDistance} />
        </div>
    )
}

export { TableHeader }
