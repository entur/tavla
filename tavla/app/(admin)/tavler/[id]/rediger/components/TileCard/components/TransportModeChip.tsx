import { TransportIcon } from 'app/(admin)/tavler/[id]/rediger/components/Settings/components/TransportIcon'
import { TTransportMode } from 'src/types/graphql-schema'
import { transportModeNames } from '../utils'

type TransportModeChipProps = {
    mode: TTransportMode
    onClick: () => void
    isSelected: boolean
}

function TransportModeChip({
    mode,
    isSelected,
    onClick,
}: TransportModeChipProps) {
    const label = transportModeNames(mode) || 'Ukjent'
    return (
        <button
            type="button"
            onClick={onClick}
            className={`flex flex-row items-center gap-2 rounded-full border px-3 py-1 transition-colors ${
                isSelected
                    ? `bg-${mode} text-white border-${mode}`
                    : 'border-slate-300 bg-white text-slate-700'
            }`}
        >
            {isSelected && (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="h-4 w-4"
                >
                    <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                    />
                </svg>
            )}
            {label}
            <TransportIcon
                transportMode={mode}
                className={`h-4 w-4 ${isSelected ? 'text-white' : `text-${mode}`}`}
            />
        </button>
    )
}

export { TransportModeChip }
