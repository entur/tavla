import { Heading4 } from '@entur/typography'
import { TFontSize } from 'types/meta'
import { FontChoiceChip } from './FontChoiceChip'

function FontChoice({ fontSize }: { fontSize?: TFontSize }) {
    return (
        <div className="box flex flex-col justify-between gap-2">
            <Heading4 margin="bottom">Tekststørrelse </Heading4>
            <FontChoiceChip font={fontSize ?? 'medium'} />
        </div>
    )
}

export { FontChoice }
