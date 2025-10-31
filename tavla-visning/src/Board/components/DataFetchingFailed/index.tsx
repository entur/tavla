import { Heading3, Paragraph } from "@entur/typography";

export const FetchErrorTypes = {
  TIMEOUT: "Request timed out",
} as const;
export type FetchErrorTypes =
  (typeof FetchErrorTypes)[keyof typeof FetchErrorTypes];

function DataFetchingFailed({ timeout = false }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="w-full text-center">
        <Heading3 className="!text-primary">
          {timeout
            ? "Innlasting av avganger tok for lang tid!"
            : "Au da! Vi greide ikke å hente avgangene!"}
        </Heading3>
        <Paragraph className="!text-primary">
          Prøv å laste inn siden på nytt. Hvis dette ikke hjelper, kontakt oss
          på tavla@entur.org
        </Paragraph>
      </div>
    </div>
  );
}

export { DataFetchingFailed };
