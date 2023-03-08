import { Dispatch, useReducer } from 'react'
import {
    EXPIRE_VEHICLE_IN_SECONDS,
    INACTIVE_VEHICLE_IN_SECONDS,
} from 'utils/constants'
import { RealtimeVehicle } from 'src/types'

export type State = {
    vehicles: Record<string, RealtimeVehicle>
}

export enum ActionType {
    HYDRATE,
    UPDATE,
    SWEEP,
}

export type Action = {
    type: ActionType
    payload?: RealtimeVehicle[]
}

const initialState: State = {
    vehicles: {},
}

function getCurrentEpochSeconds() {
    return Math.floor(Date.now() / 1000)
}

function isVehicleActive(vehicle: RealtimeVehicle, now: number) {
    return vehicle.lastUpdatedEpochSecond + INACTIVE_VEHICLE_IN_SECONDS > now
}

function isVehicleExpired(vehicle: RealtimeVehicle, now: number) {
    return vehicle.lastUpdatedEpochSecond + EXPIRE_VEHICLE_IN_SECONDS < now
}

function hydrate(payload: RealtimeVehicle[]) {
    const now = getCurrentEpochSeconds()
    const vehicles = payload.reduce(
        (acc: Record<string, RealtimeVehicle>, vehicle: RealtimeVehicle) => {
            if (isVehicleExpired(vehicle, now)) {
                return acc
            }
            return {
                ...acc,
                [vehicle.vehicleRef]: {
                    ...vehicle,
                    active: isVehicleActive(vehicle, now),
                },
            }
        },
        {},
    )
    return {
        vehicles,
    }
}

function update(state: State, payload: RealtimeVehicle[]) {
    if (payload.length === 0) {
        return state
    }
    const now = getCurrentEpochSeconds()
    const updatedVehicles = {
        ...state.vehicles,
    }

    payload.forEach((vehicle) => {
        const updatedVehicle = { ...vehicle }
        updatedVehicle.active = isVehicleActive(updatedVehicle, now)
        const currentVehicle = updatedVehicles[updatedVehicle.vehicleRef]
        if (currentVehicle) {
            if (
                updatedVehicle.lastUpdatedEpochSecond >
                currentVehicle.lastUpdatedEpochSecond
            ) {
                updatedVehicles[updatedVehicle.vehicleRef] = updatedVehicle
            }
        } else {
            updatedVehicles[updatedVehicle.vehicleRef] = updatedVehicle
        }
    })
    return {
        vehicles: updatedVehicles,
    }
}

function sweep(state: State) {
    const now = getCurrentEpochSeconds()
    const vehicles = Object.values(state.vehicles).reduce(
        (acc: Record<string, RealtimeVehicle>, vehicle: RealtimeVehicle) => {
            if (isVehicleExpired(vehicle, now)) {
                return acc
            }
            return {
                ...acc,
                [vehicle.vehicleRef]: {
                    ...vehicle,
                    active: isVehicleActive(vehicle, now),
                },
            }
        },
        {},
    )
    return {
        vehicles,
    }
}

function reducerFactory() {
    return (state: State, action: Action) => {
        switch (action.type) {
            case ActionType.HYDRATE:
                return hydrate(action?.payload as RealtimeVehicle[])
            case ActionType.UPDATE:
                return update(state, action?.payload as RealtimeVehicle[])
            case ActionType.SWEEP:
                return sweep(state)
        }
    }
}

function useVehicleReducer(): [
    { vehicles: Record<string, RealtimeVehicle> },
    Dispatch<Action>,
] {
    return useReducer(reducerFactory(), initialState)
}

export { useVehicleReducer }
