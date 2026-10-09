'use client'
import { ChatIcon, CloseIcon } from '@entur/icons'
import { ContactForm } from 'app/_components/ContactForm'
import { usePosthogTracking } from 'app/posthog/usePosthogTracking'
import { useState } from 'react'

function ContactFormButton() {
    const { capture } = usePosthogTracking()
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => {
                    setIsOpen(!isOpen)
                    if (!isOpen) {
                        capture('contact_form_opened')
                    } else {
                        capture('contact_form_closed')
                    }
                }}
                aria-label={
                    isOpen
                        ? 'Lukk skjema'
                        : 'Åpne skjema for å sende oss en melding'
                }
                className="flex items-center justify-center rounded p-2 hover:bg-blue20"
            >
                <ChatIcon size={'1.5rem'} />
            </button>
            {isOpen && (
                <div className="absolute bottom-full right-0 z-20 mb-2 max-h-[80vh] w-80 overflow-y-auto rounded bg-secondary drop-shadow-lg sm:w-96">
                    <button
                        type="button"
                        onClick={() => {
                            setIsOpen(false)
                            capture('contact_form_closed')
                        }}
                        aria-label="Lukk skjema"
                        className="absolute right-2 top-2 rounded p-1 hover:bg-blue20"
                    >
                        <CloseIcon />
                    </button>
                    <ContactForm onSuccess={() => setIsOpen(false)} />
                </div>
            )}
        </div>
    )
}

export { ContactFormButton }
