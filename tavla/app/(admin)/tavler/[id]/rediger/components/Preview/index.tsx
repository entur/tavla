'use client'

function Preview({ boardLink }: { boardLink: string }) {
    return (
        <iframe
            className="h-[80vh] w-full border-0"
            title="Tavle preview"
            src={boardLink}
        />
    )
}

export { Preview }
