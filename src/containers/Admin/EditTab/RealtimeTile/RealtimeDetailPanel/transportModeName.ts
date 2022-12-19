import { TransportMode } from '../../../../../../graphql-generated/journey-planner-v3'

const transportModeName = (mode: TransportMode): string => {
    switch (mode) {
        case 'bus':
            return 'Buss'
        case 'water':
            return 'Båt'
        case 'tram':
            return 'Trikk'
        case 'rail':
            return 'Tog'
        case 'metro':
            return 'T-bane'
        default:
            return 'Buss'
    }
}

const byTransportModeName = (a: TransportMode, b: TransportMode) =>
    transportModeName(a).localeCompare(transportModeName(b))

export { transportModeName, byTransportModeName }
