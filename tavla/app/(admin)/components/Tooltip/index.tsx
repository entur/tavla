import { useRef, useState } from 'react'
import {
    autoUpdate,
    shift,
    useFloating,
    useHover,
    offset,
    flip,
    useFocus,
    useDismiss,
    useRole,
    FloatingPortal,
    useInteractions,
    FloatingArrow,
    arrow,
} from '@floating-ui/react'
function Tooltip({
    children,
    content,
    placement,
}: {
    children: React.ReactNode
    content: string
    placement: 'top' | 'bottom' | 'left' | 'right'
}) {
    const [open, setOpen] = useState(false)
    const arrowRef = useRef(null)

    const { x, y, refs, strategy, context } = useFloating({
        open,
        onOpenChange: setOpen,
        placement: placement,
        whileElementsMounted: autoUpdate,
        middleware: [
            arrow({ element: arrowRef }),
            offset(10),
            flip({
                fallbackAxisSideDirection: 'start',
                crossAxis: false,
            }),
            shift(),
        ],
    })

    const hover = useHover(context, { move: false })
    const focus = useFocus(context)
    const dismiss = useDismiss(context)
    // for screen readers
    const role = useRole(context, { role: 'tooltip' })

    const { getReferenceProps, getFloatingProps } = useInteractions([
        hover,
        focus,
        dismiss,
        role,
    ])

    return (
        <div ref={refs.setReference} {...getReferenceProps()}>
            {children}
            <FloatingPortal>
                {open && (
                    <div
                        ref={refs.setFloating}
                        style={{
                            position: strategy,
                            top: y ?? 0,
                            left: x ?? 0,
                        }}
                        className="bg-tooltip text-tooltip-text flex items-center justify-between rounded p-2 text-center min-h-4 min-w-8 max-w-md z-50"
                        {...getFloatingProps()}
                    >
                        <FloatingArrow
                            ref={arrowRef}
                            context={context}
                            className="fill-tooltip"
                        />
                        {content}
                    </div>
                )}
            </FloatingPortal>
        </div>
    )
}

export { Tooltip }
