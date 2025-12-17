'use client'

function Preview({ boardLink }: { boardLink: string }) {
    return (
        <div className="previewContainer md:text-2xl">
            <iframe
                className="h-[80vh] w-full border-0"
                title="Tavle preview"
                src={boardLink}
            />
        </div>
    )
}

export { Preview }
