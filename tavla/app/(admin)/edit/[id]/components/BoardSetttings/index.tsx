import { Heading3 } from '@entur/typography'
import { ReactNode } from 'react'

function BoardSettings({ children }: { children: ReactNode }) {
    return (
        <>
            <div className="box flex flex-col">
                <Heading3>Tavlevisning </Heading3>

                {children}
            </div>
        </>
    )
}

export { BoardSettings }
