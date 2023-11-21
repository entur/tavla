'use client'
import { Tooltip as EnturTooltip, TooltipProps } from '@entur/tooltip'

function Tooltip(props: TooltipProps) {
    return <EnturTooltip {...props}>{props.children}</EnturTooltip>
}

export { Tooltip }
