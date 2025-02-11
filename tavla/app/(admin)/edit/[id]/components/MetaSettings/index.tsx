import { Heading3 } from '@entur/typography'
import { ReactNode } from 'react'

function MetaSettings({ children }: { children: ReactNode }) {
    return (
        <div className="box">
            <Heading3> Generelt </Heading3>
            <div className="flex flex-col gap-16">{children}</div>
        </div>
    )
}

export { MetaSettings }
