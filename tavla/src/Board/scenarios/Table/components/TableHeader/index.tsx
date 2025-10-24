import { BoardWalkingDistanceDB } from 'types/db-types/boards'
import { WalkingDistance } from '../WalkingDistance'

function TableHeader({
    heading,
    walkingDistance,
}: {
    heading: string
    walkingDistance?: BoardWalkingDistanceDB
}) {
    return (
        <div className="mb-2 flex min-h-[2.5em] flex-row items-center justify-between">
            <h1 className="m-0 line-clamp-2 hyphens-auto text-em-xl2 font-semibold leading-em-base">
                {heading}
            </h1>

            <WalkingDistance walkingDistance={walkingDistance} />
        </div>
    )
}

export { TableHeader }
