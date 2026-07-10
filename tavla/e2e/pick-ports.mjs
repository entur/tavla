import fs from 'node:fs'
import net from 'node:net'
import path from 'node:path'

// Ports the local dev setup (`yarn dev` / `yarn dev:persist`) binds. The e2e
// emulator must never land on any of these, otherwise a concurrent test run
// could reset dev's emulator and wipe its persisted `.db` state. The emulator
// ports come straight from firebase.json so this stays in sync if they change.
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
    4000, // firebase emulator UI (defaults to 4000, not set in firebase.json)
    3000, // next dev / dev:persist
    3001, // local backend
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

// OS-assigned free ports come from the ephemeral range (well above the reserved
// ports), so a collision is already practically impossible — this re-rolls to
// make it a hard guarantee. `taken` keeps the ports mutually distinct while the
// bound servers are held open below.
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

// Pick sequentially, holding each server open, so the OS cannot hand the same
// port to two of them before we record it as taken.
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
