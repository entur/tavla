function Pulse() {
    return (
        <div className="relative flex h-full w-full">
            <span className="animate-ping-slow absolute inline-flex rounded-full bg-success h-[0.75em] w-[0.75em] left-[calc(50%-(0.75em/2))] bottom-[calc(50%-(0.75em/2))]"></span>
            <span className="relative inline-flex rounded-full bg-success  h-[0.75em] w-[0.75em] left-[calc(50%-(0.75em/2))] bottom-[calc(50%-(0.75em/2))]"></span>
        </div>
    )
}

export { Pulse }
