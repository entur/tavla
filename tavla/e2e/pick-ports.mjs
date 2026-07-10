import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'

const baseFirebaseConfig = JSON.parse(
    fs.readFileSync(
        path.join(import.meta.dirname, '..', 'firebase.json'),
        'utf-8',
    ),
)
const RESERVED = new Set([
    ...Object.values(baseFirebaseConfig.emulators)
        .map((emulator) => emulator?.port)
        .filter((port) => typeof port === 'number'),
    4000, // firebase emulator UI
    3000, // port brukt av dev:persist
    3001, // lokal backen
])

function listenOnFreePort() {
    return new Promise((resolve, reject) => {
        const server = net.createServer()
        server.on('error', reject)
        server.listen(0, '127.0.0.1', () => {
            const { port } = server.address()
            resolve({ server, port })
        })
    })
}

async function pickPort(taken) {
    for (let attempt = 0; attempt < 50; attempt++) {
        const bound = await listenOnFreePort()
        if (RESERVED.has(bound.port) || taken.has(bound.port)) {
            await new Promise((resolve) => bound.server.close(resolve))
            continue
        }
        return bound
    }
    throw new Error(
        'pick-ports: no free non-reserved port found after 50 attempts',
    )
}

const keys = ['auth', 'firestore', 'storage', 'ui', 'next']

const bound = []
const taken = new Set()
for (const _key of keys) {
    const picked = await pickPort(taken)
    taken.add(picked.port)
    bound.push(picked)
}

const ports = Object.fromEntries(
    keys.map((key, index) => [key, bound[index].port]),
)

await Promise.all(
    bound.map(({ server }) => new Promise((resolve) => server.close(resolve))),
)

process.stdout.write(JSON.stringify(ports))
