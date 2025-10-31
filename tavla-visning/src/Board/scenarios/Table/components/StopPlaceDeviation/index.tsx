import type { TSituationFragment } from "../../../../../Shared/graphql";
import { useCycler } from "../../useCycler";
import { TitleSituation } from "../Situation";

const timerInMilliseconds = 10000;

function StopPlaceQuayDeviation({
  situations,
}: {
  situations?: TSituationFragment[];
}) {
  const index = useCycler(situations, timerInMilliseconds);
  const numberOfSituations = situations?.length ?? 0;

  if (!situations || numberOfSituations === 0) return null;
  return (
    <div className="mt-[-1em] min-h-[1.5em]">
      {situations && numberOfSituations > 0 && (
        <TitleSituation situation={situations[index % numberOfSituations]} />
      )}
    </div>
  );
}

function CombinedTileDeviation({
  situations,
}: {
  situations?: TSituationFragment[];
}) {
  const index = useCycler(situations, timerInMilliseconds);
  const numberOfSituations = situations?.length ?? 0;

  return (
    <div className="mt-[0.5em] min-h-[1.5em] pb-[1em]">
      {situations && numberOfSituations > 0 && (
        <TitleSituation situation={situations[index % numberOfSituations]} />
      )}
    </div>
  );
}

export { CombinedTileDeviation, StopPlaceQuayDeviation };
