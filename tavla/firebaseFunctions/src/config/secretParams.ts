import { defineSecret } from 'firebase-functions/params'

type SecretParam = {
    name: string
    value: () => string
}

export const secretParams: SecretParam[] = []

function createSecret(name: string): SecretParam {
    const secret = defineSecret(name)
    secretParams.push(secret)
    return secret
}

export const BACKEND_KEY = createSecret('BACKEND_API_KEY')
export const SLACK_WEBHOOK_TAVLETALL = createSecret('SLACK_WEBHOOK_TAVLETALL')
