import { TSituation } from "@/types/stopPlace";

function Situation({ situation }: { situation: TSituation }) {
  return (
    <div className="header-text">
      {situation.description.find((desc) => desc.language === "no")?.value}
    </div>
  );
}

export { Situation };
