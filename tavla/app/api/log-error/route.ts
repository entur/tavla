// app/api/log-error/route.ts
import { logServerError } from 'app/(admin)/utils/serverErrorLogger'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { error } = await request.json()
        if (error) {
            await logServerError({
                message: error.message,
                stack: error.stack,
                name: error.name,
                cause: error.cause,
                digest: error.digest,
            })
            return NextResponse.json(
                { message: 'Error logged successfully' },
                { status: 200 },
            )
        }
    } catch (err) {
        return NextResponse.json(
            { message: 'Error logging failed' },
            { status: 500 },
        )
    }
}
