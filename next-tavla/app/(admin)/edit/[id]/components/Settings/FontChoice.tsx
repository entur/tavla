import { Heading3 } from '@entur/typography'
import { TFontSize } from 'types/meta'
import { FontChoiceChip } from './FontChoiceChip'

function FontChoice({ fontSize }: { fontSize?: TFontSize }) {
    return (
        <div className="box flex flex-col justify-between">
            <Heading3 margin="bottom">Tekststørrelse </Heading3>
            <FontChoiceChip font={fontSize ?? 'medium'} />
        </div>
    )
}

export { FontChoice }
