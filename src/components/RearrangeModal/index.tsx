import React from 'react'

import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from 'react-beautiful-dnd'

import { Modal } from '@entur/modal'
import { PrimaryButton } from '@entur/button'
import { DraggableIcon } from '@entur/icons'

import './styles.scss'

function RearrangeModal({
    itemOrder: itemOrder,
    onTileOrderChanged,
    modalVisible,
    onDismiss,
}: Props): JSX.Element {
    const reorder = (list: Item[], fromIndex: number, toIndex: number) => {
        const itemToMove = list[fromIndex]
        const restOfItems = list.filter((_, index) => index !== fromIndex)
        return [
            ...restOfItems.slice(0, toIndex),
            itemToMove,
            ...restOfItems.slice(toIndex),
        ]
    }

    function onDragEnd(result: DropResult): void {
        if (!result.destination) return
        if (result.destination.index === result.source.index) return
        const rearrangedTileOrder = reorder(
            itemOrder,
            result.source.index,
            result.destination.index,
        )

        onTileOrderChanged(rearrangedTileOrder)
    }
    return (
        <Modal
            open={modalVisible}
            onDismiss={onDismiss}
            title="Endre rekkefølge"
            size="medium"
            className="rearrange-modal"
        >
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {(droppableProvided) => (
                        <div
                            {...droppableProvided.droppableProps}
                            ref={droppableProvided.innerRef}
                        >
                            {itemOrder.map((item, index) => (
                                <Draggable
                                    key={item.id}
                                    draggableId={item.id}
                                    index={index}
                                >
                                    {(draggableProvided, draggableSnapshot) => (
                                        <div
                                            className={`rearrange-modal__draggable-row ${
                                                draggableSnapshot.isDragging
                                                    ? 'rearrange-modal__draggable-row--is-dragging'
                                                    : ''
                                            }`}
                                            ref={draggableProvided.innerRef}
                                            {...draggableProvided.draggableProps}
                                            {...draggableProvided.dragHandleProps}
                                        >
                                            {item.name}
                                            <DraggableIcon />
                                        </div>
                                    )}
                                </Draggable>
                            ))}
                            {droppableProvided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <PrimaryButton onClick={() => onDismiss()}>Lukk</PrimaryButton>
        </Modal>
    )
}

interface Props {
    itemOrder: Item[]
    modalVisible: boolean
    onDismiss: () => void
    onTileOrderChanged: (newTileOrder: Item[]) => void
}

export interface Item {
    id: string
    name: string
}

export default RearrangeModal
