import { NextRequest, NextResponse } from 'next/server'
import client from 'prom-client'

const collectDefaultMetrics = client.collectDefaultMetrics
const Registry = client.Registry
const register = new Registry()
collectDefaultMetrics({ register })
const username = process.env.METRICS_USERNAME || 'username'
const password = process.env.METRICS_PASSWORD || 'password'
const authString =
    'Basic ' + Buffer.from(`${username}:${password}`).toString('base64')

export async function GET(req: NextRequest) {
    if (req.headers.get('authorization') !== authString) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const metrics = await register.metrics()
    return new Response(metrics, {
        headers: {
            'Content-Type': register.contentType,
        },
    })
}
