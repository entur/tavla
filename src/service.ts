import createEnturClient from '@entur/sdk'

const CLIENT_NAME = process.env.CLIENT_NAME || ''

if (!CLIENT_NAME && process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.error(
        'CLIENT_NAME is missing! Please set a client name in your environment config.',
    )
}

const enturClient = createEnturClient({
    clientName: CLIENT_NAME,
    hosts: {
        journeyPlanner: process.env.JOURNEYPLANNER_HOST_V2,
        geocoder: process.env.GEOCODER_HOST,
        mobility: process.env.MOBILITY_HOST,
    },
})

export { enturClient }
