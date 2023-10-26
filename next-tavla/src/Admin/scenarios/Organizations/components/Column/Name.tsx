import { Cell } from './Cell'

function Name({ name }: { name: string }) {
    return <Cell className="min-w-rem-30">{name}</Cell>
}

export { Name }
