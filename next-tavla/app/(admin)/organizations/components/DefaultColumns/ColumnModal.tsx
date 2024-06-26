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
                Den oppsatte rutetiden for når avgangen skal dra fra
                stoppestedet.
            </SubParagraph>
            <Heading4>Ankomst </Heading4>
            <SubParagraph>
                Når transportmiddelet ankommer stoppestedet.
            </SubParagraph>
            <Heading4>Forventet </Heading4>
            <SubParagraph>
                Når det er forventet at avgangen skal gå. Dette kan være
                påvirket av om den er forsinket eller innstilt
            </SubParagraph>
            <Heading4>Sanntid </Heading4>
            <SubParagraph>
                Indikerer om tidspunktet er oppdatert med sanntidsinformasjon.
            </SubParagraph>
        </Modal>
    )
}

export { ColumnModal }
