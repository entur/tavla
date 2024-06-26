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
            <SubParagraph>Den oppsatte rutetiden.</SubParagraph>
            <Heading4>Ankomst </Heading4>
            <SubParagraph>
                Når transportmiddelet ankommer stoppestedet.
            </SubParagraph>
            <Heading4>Forventet </Heading4>
            <SubParagraph>
                {' '}
                Når det er forventet at avgangen skal gå. Dette kan være
                påvirket av om den er forsinket eller innstilt
            </SubParagraph>
            <Heading4>Et eksempel </Heading4>
            <SubParagraph>
                Et tog er planlagt å gå kl. 14:00, så i rutetabellen vil det stå
                at den kommer da. Det kan hende den ankommer plattformen 15
                minutter før, for en pause eller bytte av sjåfør, og da vil
                ankomst tiden vise 13:45. Om toget har blitt forsinket med 3
                minutter, vil den nye tiden når toget skal gå være 14:03.
                Forventet tid er når den faktisk er forventet å dra fra
                plattformen.
            </SubParagraph>
        </Modal>
    )
}

export { ColumnModal }
