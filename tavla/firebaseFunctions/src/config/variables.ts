import { defineString } from 'firebase-functions/params'

type StringParam = ReturnType<typeof defineString>

export const apiBaseUrl: StringParam = defineString('API_BASE_URL')
export const stopPlaceUrl: StringParam = defineString('STOP_PLACE_URL')
export const geocoderUrl: StringParam = defineString('GEOCODER_URL')
export const quayUrl: StringParam = defineString('QUAY_URL')
