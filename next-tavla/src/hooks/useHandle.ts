import { Dispatch, SetStateAction, useState } from 'react'
import { SyntheticListenerMap } from '@dnd-kit/core/dist/hooks/utilities'
import { DraggableAttributes } from '@dnd-kit/core'

function useHandle(): [
    (
        | {
              attributes: DraggableAttributes
              listeners: SyntheticListenerMap | undefined
          }
        | undefined
    ),
    Dispatch<
        SetStateAction<
            | undefined
            | {
                  attributes: DraggableAttributes
                  listeners: SyntheticListenerMap | undefined
              }
        >
    >,
] {
    const [handle, setHandle] = useState<
        | {
              attributes: DraggableAttributes
              listeners: SyntheticListenerMap | undefined
          }
        | undefined
    >(undefined)

    return [handle, setHandle]
}

export { useHandle }
