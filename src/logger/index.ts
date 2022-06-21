import splitbee from '@splitbee/web'

import { Events, EventData } from './events'

export function logEvent(event: Events, data?: EventData) {
    splitbee.track(event, data)
}
