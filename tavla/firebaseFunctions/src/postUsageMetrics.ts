import * as admin from 'firebase-admin'
import { SLACK_WEBHOOK_TAVLETALL } from './config/secretParams'
import { scheduledFunction } from './functions'
import { getActiveBoardsFromRedis } from './backendUtils'
import { getRuntimeConfig } from './config'

admin.initializeApp()

type LocationDetails = {
    raw: string
    lat: string
    lon: string
    topographic_ref?: string
    placeId: string
}

export const postUsageMetrics = scheduledFunction(
    '0 11 * * 3',
    undefined,
    async () => {
        
        const { stopPlaceUrl, quayUrl, geocoderUrl } = getRuntimeConfig()

        const activeBoards = await getActiveBoardsFromRedis()
        const boardCollection = admin.firestore().collection('boards')
        
        const countyCount: Record<string, number> = {}
        const paletteCount: Record<string, number> = {}

        let failed = 0
        let total = 0
         
        for (const client of activeBoards.clients) {
            const board = await boardCollection.doc(client.bid).get()
        
            const placeId: string  = board.data()?.tiles[0]?.placeId
            const palette: string  = board.data()?.transportPalette ?? 'default'
            
            if (placeId == undefined) {
                console.error(`Failed to get placeId. Board with no stops added?`)
                failed++
                continue
            }

            if(paletteCount[palette])
                paletteCount[palette]++
            else
                paletteCount[palette] = 1

            const details = await fetch(`${placeId.startsWith('NSR:StopPlace:') ?  stopPlaceUrl : quayUrl }/${placeId}`, {
                headers: {
                    'ET-Client-Name': 'tavla-board-stats' 
                }
            })
            
            if (!details.ok) {
                console.error(`Failed to fetch details for board ${client.bid} with placeId ${placeId}: ${details.status} ${details.statusText}`)
                continue
            }

            const response = await details.json()
            
            const centroid = response['centroid']
            let lat = centroid['latitude']
            let lon = centroid['longitude']

            if(lat == undefined || lon == undefined) {
                lat = centroid['location']['latitude']
                lon = centroid['location']['longitude']
            }

            const results: LocationDetails = {
                raw: response,
                lat: lat,
                lon: lon,
                topographic_ref: undefined,
                placeId: placeId
            }

            const geocodeParams = `?point.lat=${results.lat}&point.lon=${results.lon}&boundary.circle.radius=10&size=1&layers=venue`

            const geocoderResponse = await fetch(`${geocoderUrl}${geocodeParams}`,  {
                headers: {
                    'ET-Client-Name': 'tavla-board-stats' 
                }
            }).then(res => res.json())

            const county  = geocoderResponse['features'][0]['properties']['county']

            if(countyCount[county])
                countyCount[county]++
            else
                countyCount[county] = 1

            total++
        }


        let message = `God onsdag teamet! 👋🤓  Her kommer ukens TavleTall™️:

Aktive tavler 📈: ${total} (uten stoppested/quay: ${failed})

Fordelt på fylker 👇`
        
        for (const [county, count] of Object.entries(countyCount)) {
            message += `\n${county}: ${count}`
        }

        message += `\n\nOg fargevalg 🎨:`

        for (const [palette, count] of Object.entries(paletteCount)) {
            message += `\n${palette}: ${count}`
        }

        fetch(`${SLACK_WEBHOOK_TAVLETALL.value()}`, {
            method: 'POST',
            body: JSON.stringify({
                'text': message
            })
        })
    },
)
