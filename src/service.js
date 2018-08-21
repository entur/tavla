import EnturService from '@entur/sdk'

export default new EnturService({
    clientName: 'entur-tavla',
    hosts: {
        journeyplanner: process.env.JOURNEYPLANNER_HOST,
        geocoder: process.env.GEOCODER_HOST,
    },
})
