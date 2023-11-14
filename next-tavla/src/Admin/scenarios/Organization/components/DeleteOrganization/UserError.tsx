import { SmallAlertBox } from '@entur/alert'
import { TOrgError } from 'Admin/types/organizations'

function UserError({ error }: { error?: TOrgError }) {
    if (!error) return null
    return <SmallAlertBox variant="error">{error.value}</SmallAlertBox>
}

export { UserError }
