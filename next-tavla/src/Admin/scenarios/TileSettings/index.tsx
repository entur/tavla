import { TTile } from 'types/tile'
import { TileSettingsWrapper } from './components/TileSettingsWrapper'
import { Heading3, Paragraph } from '@entur/typography'
import classes from './styles.module.css'
import { StopPlaceSettings } from './components/StopPlaceSettings'
import { QuaySettings } from './components/QuaySettings'

function TileSettings({ tile }: { tile?: TTile; name?: string }) {
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
        <div>
            <Heading3>Rediger holdeplass</Heading3>
            {tile.type === 'stop_place' && <StopPlaceSettings tile={tile} />}
            {tile.type === 'quay' && <QuaySettings tile={tile} />}
        </div>
    )
}

export { TileSettings }