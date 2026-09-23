'use client'

export type LensType = 'platform' | 'line'

const OPTIONS: { value: LensType; label: string }[] = [
    { value: 'platform', label: 'Plattform' },
    { value: 'line', label: 'Linje' },
]

export function LensToggle({
    lens,
    onChange,
}: {
    lens: LensType
    onChange: (lens: LensType) => void
}) {
    return (
        <fieldset className="flex flex-row items-center gap-2 border-0 p-0">
            <legend className="float-left mr-2 text-sm text-[#626493]">
                Grupper etter
            </legend>
            <div className="flex flex-row overflow-hidden rounded-full border">
                {OPTIONS.map((option) => {
                    const isActive = lens === option.value
                    return (
                        <label
                            key={option.value}
                            className={`cursor-pointer px-4 py-1.5 text-sm transition-colors focus-within:outline focus-within:outline-2 focus-within:outline-black ${
                                isActive
                                    ? 'bg-contrast text-white'
                                    : 'bg-white text-chipUnselected'
                            }`}
                        >
                            <input
                                type="radio"
                                name="stop-place-lens"
                                value={option.value}
                                checked={isActive}
                                onChange={() => onChange(option.value)}
                                className="sr-only"
                            />
                            {option.label}
                        </label>
                    )
                })}
            </div>
        </fieldset>
    )
}
