import React from 'react'
import {
    TransportMode,
    TransportSubmode,
} from 'graphql-generated/journey-planner-v3'
import { IconColorType } from 'src/types'
import { getIconColor, getTransportIconIdentifier } from 'utils/icon'
import {
    BicycleIcon,
    BusIcon,
    CarferryIcon,
    FerryIcon,
    PlaneIcon,
    SubwayIcon,
    TrainIcon,
    TramIcon,
} from '@entur/icons'

interface Props {
    transportMode: TransportMode
    iconColorType?: IconColorType
    transportSubmode?: TransportSubmode
    color?: string
    className?: string
}

const TransportModeIcon: React.FC<Props> = ({
    transportMode,
    iconColorType = IconColorType.CONTRAST,
    transportSubmode,
    color,
    className,
}) => {
    const colorToUse =
        color ?? getIconColor(transportMode, iconColorType, transportSubmode)

    const identifier = getTransportIconIdentifier(
        transportMode,
        transportSubmode,
    )

    switch (identifier) {
        case 'bus':
            return (
                <BusIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        case 'bicycle':
            return (
                <BicycleIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        case 'carferry':
            return (
                <CarferryIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        case 'ferry':
            return (
                <FerryIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        case 'subway':
            return (
                <SubwayIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        case 'train':
            return (
                <TrainIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        case 'tram':
            return (
                <TramIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        case 'plane':
            return (
                <PlaneIcon
                    key={identifier}
                    color={colorToUse}
                    className={className}
                />
            )
        default:
            return null
    }
}

export { TransportModeIcon }
