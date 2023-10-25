import { StyledColumn } from './StyledColumn'

function Name({ name }: { name: string }) {
    return <StyledColumn className="min-w-15-rem">{name}</StyledColumn>
}

export { Name }
