import { SmallAlertBox } from '@entur/alert'
import { TAuthError } from 'Admin/types/login'

function UserError({ error }: { error?: TAuthError }) {
    if (!error || error.type !== 'user') return null
    return <SmallAlertBox variant="error">{error.value}</SmallAlertBox>
}

export { UserError }
