'use client'
import { ContrastProps, Contrast as EnturContrast } from '@entur/layout'

function Contrast(props: ContrastProps<'div'>) {
    return <EnturContrast {...props}>{props.children}</EnturContrast>
}

export { Contrast }
