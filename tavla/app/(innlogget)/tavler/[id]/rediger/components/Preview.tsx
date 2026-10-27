'use client'

function Preview({
    boardLink,
    viewMode,
}: {
    boardLink: string
    viewMode: string | null
}) {
    return (
        <section
            className={`previewContainer border-0 md:text-2xl flex items-center justify-center ${
                viewMode === 'Stående' ? 'h-full' : 'w-full'
            }`}
            aria-label="Forhåndsvisning av tavle"
        >
            <iframe
                className={
                    viewMode === 'Stående'
                        ? 'aspect-[9/16] h-full max-w-full'
                        : 'aspect-[16/9] w-full max-h-full'
                }
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
