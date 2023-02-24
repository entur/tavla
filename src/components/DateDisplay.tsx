import React from 'react'
import { format } from 'date-fns'
import nb from 'date-fns/locale/nb'

function DateDisplay({ date, className }: { date: Date; className?: string }) {
    const formatedDate = format(date, 'd. MMM', { locale: nb })

    return <div className={className}>{`(${formatedDate})`}</div>
}

export { DateDisplay }
