import { Dispatch, useReducer } from 'react'
import { RealtimeVehicle } from '../services/realtimeVehicles/types/realtimeVehicle'
import {
    EXPIRE_VEHICLE_IN_SECONDS,
    INACTIVE_VEHICLE_IN_SECONDS,
} from '../constants'

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
    payload?: RealtimeVehicle[] | RealtimeVehicle
}

const initialState: State = {
    vehicles: {},
}

const getCurrentEpochSeconds = () => Math.floor(Date.now() / 1000)

const isVehicleActive = (vehicle: RealtimeVehicle, now: number) =>
    vehicle.lastUpdatedEpochSecond + INACTIVE_VEHICLE_IN_SECONDS > now

const isVehicleExpired = (vehicle: RealtimeVehicle, now: number) =>
    vehicle.lastUpdatedEpochSecond + EXPIRE_VEHICLE_IN_SECONDS < now

const hydrate = (payload: RealtimeVehicle[]) => {
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

const update = (state: State, payload: RealtimeVehicle[]) => {
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

const sweep = (state: State) => {
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

const reducerFactory = () => (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.HYDRATE:
            return hydrate(action?.payload as RealtimeVehicle[])
        case ActionType.UPDATE:
            return update(state, action?.payload as RealtimeVehicle[])
        case ActionType.SWEEP:
            return sweep(state)
    }
}

const useVehicleReducer = (): [
    { vehicles: Record<string, RealtimeVehicle> },
    Dispatch<Action>,
] => useReducer(reducerFactory(), initialState)

export { useVehicleReducer }
