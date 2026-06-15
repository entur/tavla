'use client'

function Preview({ boardLink }: { boardLink: string }) {
    return (
        <section
            className="previewContainer md:text-2xl"
            aria-label="Forhåndsvisning av tavle"
        >
            <iframe
                className="h-[80vh] w-full border-0"
                title="Forhåndsvisning av tavle"
                src={boardLink}
                sandbox="allow-scripts allow-same-origin"
                referrerPolicy="no-referrer"
                tabIndex={-1}
            />
        </section>
    )
}

export { Preview }
