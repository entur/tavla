import { defineString } from 'firebase-functions/params'

type StringParam = ReturnType<typeof defineString>

export const apiBaseUrl: StringParam = defineString('API_BASE_URL')
