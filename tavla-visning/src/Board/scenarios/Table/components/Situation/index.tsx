import { PageNavigationIcon } from "@entur/icons";
import type { TSituationFragment } from "../../../../../Shared/graphql";

function TitleSituation({
  situation,
}: {
  situation: TSituationFragment | undefined;
  origin?: string;
}) {
  const situationText =
    situation?.summary.find((summary) => summary.language === "no")?.value ??
    situation?.summary[0]?.value ??
    situation?.description.find((desc) => desc.language === "no")?.value ??
    situation?.description[0]?.value ??
    null;

  const origin = situation?.origin;
  if (!situationText) return null;

  return (
    <div className="mt-[0.1em] flex min-h-max items-center gap-[8px] text-em-situation/em-situation text-warning">
      <div className="flex self-start pt-[0.05em] text-[1.8em]">
        <PageNavigationIcon aria-label="" size="0.5em" />
      </div>
      <p className="font-normal">
        {origin && <b>{origin + ": "}</b>}
        {situationText}
      </p>
    </div>
  );
}

export { TitleSituation };
