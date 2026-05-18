import { SmallAlertBox } from '@entur/alert'
import type { VariantType } from '@entur/form'

function FormError({
    feedback,
    variant,
}: {
    feedback?: string
    variant?: VariantType
}) {
    if (!feedback || !variant) return null
    return <SmallAlertBox variant={variant}>{feedback}</SmallAlertBox>
}

export { FormError }
