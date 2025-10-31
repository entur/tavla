import type { BoardWalkingDistanceDB } from "../../../../../Shared/types/db-types/boards";
import { WalkingDistance } from "../WalkingDistance";

function TableHeader({
  heading,
  walkingDistance,
}: {
  heading: string;
  walkingDistance?: BoardWalkingDistanceDB;
}) {
  return (
    <div className="mb-1 flex min-h-[2.2em] flex-row items-center justify-between">
      <h1 className="m-0 line-clamp-2 text-em-xl2 leading-em-base font-bold">
        {heading}
      </h1>

      <WalkingDistance walkingDistance={walkingDistance} />
    </div>
  );
}

export { TableHeader };
