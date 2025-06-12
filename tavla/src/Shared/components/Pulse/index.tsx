function Pulse() {
    return (
        <div className="relative flex h-full w-full">
            <span className="pulse absolute animate-pulse"></span>
            <span className="pulse relative"></span>
        </div>
    )
}

export { Pulse }
