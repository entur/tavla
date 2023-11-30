import { SmallAlertBox } from '@entur/alert'
import { VariantType } from '@entur/form'

function UserError({
    feedback,
    variant,
}: {
    feedback?: string
    variant?: VariantType
}) {
    if (!feedback || !variant) return null
    return <SmallAlertBox variant={variant}>{feedback}</SmallAlertBox>
}

export { UserError }
