import { StyledColumn } from './StyledColumn'

function Name({ name }: { name: string }) {
    return <StyledColumn className="min-w-rem-30">{name}</StyledColumn>
}

export { Name }
