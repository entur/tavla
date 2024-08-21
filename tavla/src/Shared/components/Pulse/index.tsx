function Pulse() {
    return (
        <div className="relative flex h-full w-full">
            <span className="animate-ping-slow absolute pulse"></span>
            <span className="relative pulse"></span>
        </div>
    )
}

export { Pulse }
