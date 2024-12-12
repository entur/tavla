import { LRUCache } from 'lru-cache'

type TOptions = {
    maxUniqueTokens?: number
    interval?: number
}

export default function rateLimit(options: TOptions) {
    const cache = new LRUCache({
        max: options.maxUniqueTokens || 500,
        ttl: options.interval || 60 * 1000,
    })

    return {
        check: async (res: Response, limit: number, token: string) => {
            return new Promise<void>((resolve, reject) => {
                let tokenCount = (cache.get(token) as number) || 0

                tokenCount += 1
                cache.set(token, tokenCount)
                const currentUsage = tokenCount ?? 0
                const isRateLimited = currentUsage >= limit
                const remaining = isRateLimited ? 0 : limit - currentUsage
                res.headers.set('X-RateLimit-Limit', limit.toString())
                res.headers.set('X-RateLimit-Remaining', remaining.toString())
                if (isRateLimited) {
                    return reject()
                } else {
                    return resolve()
                }
            })
        },
    }
}
