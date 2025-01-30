import { IllustratedInfo } from 'app/(admin)/components/IllustratedInfo'

function UnsupportedBrowser() {
    return (
        <IllustratedInfo
            title="Beklager, vi støtter ikke nettleseren din!"
            description="Dessverre krever Tavla en nyere nettleser for å fungere som den
                skal. For hjelp, kontakt oss på tavla@entur.org."
        ></IllustratedInfo>
    )
}

export default UnsupportedBrowser
