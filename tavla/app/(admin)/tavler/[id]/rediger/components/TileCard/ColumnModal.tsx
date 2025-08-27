import { Modal } from '@entur/modal'
import { Heading2, Heading4, SubParagraph } from '@entur/typography'

function ColumnModal({
    isOpen,
    setIsOpen,
}: {
    isOpen: boolean
    setIsOpen: (arg0: boolean) => void
}) {
    return (
        <Modal open={isOpen} onDismiss={() => setIsOpen(false)} size="medium">
            <Heading2 as="h1"> Dette betyr kolonnene </Heading2>
            <Heading4 as="h2">Planlagt </Heading4>
            <SubParagraph>
                Rutetid for avgangen til kjøretøyet. Påvirkes ikke av sanntid.
            </SubParagraph>
            <Heading4 as="h2">Ankomst </Heading4>
            <SubParagraph>
                Når kjøretøyet ankommer stoppestedet. Viser sanntid, hvis det
                finnes. Hvis ikke vises rutetid.
            </SubParagraph>
            <Heading4 as="h2">Plattform </Heading4>
            <SubParagraph>Forkortelse for plattform.</SubParagraph>
            <Heading4 as="h2">Forventet </Heading4>
            <SubParagraph>
                Forventet avgangstid for kjøretøyet. Viser sanntid, hvis det
                finnes. Hvis ikke vises rutetid (det samme tidspunktet som vises
                under “Planlagt”).
            </SubParagraph>
        </Modal>
    )
}

export { ColumnModal }
