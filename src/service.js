import EnturService from '@entur/sdk'

export default new EnturService({
    clientName: 'entur-tavla',
    hosts: {
        journeyplanner: process.env.JOURNEYPLANNER_HOST || 'https://api.entur.org/journeyplanner/2.0/index',
        geocoder: process.env.GEOCODER_HOST || 'https://api.entur.org/api/geocoder/1.1',
    },
})
