import { Modal } from '@entur/modal'
import { Heading4, SubParagraph } from '@entur/typography'

function ColumnModal({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: (arg0: boolean) => void
}) {
    return (
        <Modal
            open={isOpen}
            onDismiss={() => setIsOpen(false)}
            title="Dette betyr kolonnene"
            size="medium"
        >
            <Heading4>Planlagt </Heading4>
            <SubParagraph>
                Rutetid for avgangen til kjøretøyet. Påvirkes ikke av sanntid.
            </SubParagraph>
            <Heading4>Ankomst </Heading4>
            <SubParagraph>
                Når kjøretøyet ankommer stoppestedet. Viser sanntid, hvis det
                finnes. Hvis ikke vises rutetid.
            </SubParagraph>
            <Heading4>Forventet </Heading4>
            <SubParagraph>
                Forventet avgangstid for kjøretøyet. Viser sanntid, hvis det
                finnes. Hvis ikke vises rutetid (det samme tidspunktet som vises
                under “Planlagt”).
            </SubParagraph>
            <Heading4>Sanntidsikon </Heading4>
            <SubParagraph>
                Legger til et sanntidsikon i tavlen som pulserer. Indikerer om
                tidspunktet er oppdatert med sanntidsinformasjon.
            </SubParagraph>
        </Modal>
    )
}

export { ColumnModal }
