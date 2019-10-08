import EnturService from '@entur/sdk'

export default new EnturService({
    clientName: 'entur-tavla',
    hosts: {
        // @ts-ignore
        journeyplanner: process.env.JOURNEYPLANNER_HOST,
        // @ts-ignore
        geocoder: process.env.GEOCODER_HOST,
    },
})
