import { Heading3, Paragraph } from '@entur/typography'

function UnsupportedBrowser() {
    return (
        <div className="w-full text-center flex flex-col items-center justify-center root">
            <Heading3 className="!text-primary">
                Beklager, vi støtter ikke nettleseren din!
            </Heading3>
            <Paragraph className="!text-primary">
                Dessverre krever Tavla en nyere nettleser for å fungere som den
                skal. For hjelp, kontakt oss på tavla@entur.org
            </Paragraph>
        </div>
    )
}

export default UnsupportedBrowser
