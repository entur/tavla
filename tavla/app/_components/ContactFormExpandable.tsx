'use client'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ContactForm } from './ContactForm'
import { Expandable } from './Expandable'

function ContactFormExpandable() {
    const { capture } = usePosthogTracking()
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(false)

    if (pathname.includes('/rediger-beta')) return null

    return (
        <div className="flex w-full items-center justify-center xl:w-1/6">
            <Expandable
                title="Send oss en melding"
                isOpen={isOpen}
                setIsOpen={(open) => {
                    setIsOpen(open)
                    if (open) {
                        capture('contact_form_opened')
                    } else {
                        capture('contact_form_closed')
                    }
                }}
            >
                <ContactForm onSuccess={() => setIsOpen(false)} />
            </Expandable>
        </div>
    )
}

export { ContactFormExpandable }
