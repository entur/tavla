import { TTile } from 'types/tile'
import { TileSettingsWrapper } from './components/TileSettingsWrapper'

import { SelectLines } from '../SelectLines'
import { Paragraph } from '@entur/typography'
import classes from './styles.module.css'

function TileSettings({ tile, name }: { tile?: TTile; name?: string }) {
    if (!tile) {
        return (
            <TileSettingsWrapper className={classes.emptyTileWrapper}>
                <Paragraph>
                    Wops! Du har ikke markert en holdeplass enda. Legg til en
                    holdeplass eller trykk på en som allerede ligger i lista til
                    venstre for å kunne bestemme plattformer og linjer som skal
                    vises på avgangstavla.
                </Paragraph>
            </TileSettingsWrapper>
        )
    }

    return (
        <TileSettingsWrapper name={name}>
            <SelectLines tile={tile} />
        </TileSettingsWrapper>
    )
}

export { TileSettings }
