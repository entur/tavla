import { Dispatch, useReducer } from 'react'

import { RealtimeVehicle } from '../services/realtimeVehicles/types/realtimeVehicle'
import { Options } from '../services/realtimeVehicles/types/options'
import {
    DEFAULT_EXPIRE_VEHICLE_IN_SECONDS,
    DEFAULT_INACTIVE_VEHICLE_IN_SECONDS,
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

const isVehicleInactive = (
    vehicle: RealtimeVehicle,
    options: Options,
    now: number,
) =>
    vehicle.lastUpdatedEpochSecond +
        (options?.markInactiveAfterSeconds ||
            DEFAULT_INACTIVE_VEHICLE_IN_SECONDS) <
    now

const isVehicleExpired = (
    vehicle: RealtimeVehicle,
    options: Options,
    now: number,
) =>
    vehicle.lastUpdatedEpochSecond +
        (options?.removeExpiredAfterSeconds ||
            DEFAULT_EXPIRE_VEHICLE_IN_SECONDS) <
        now || vehicle.expirationEpochSecond < now

const hydrate = (payload: RealtimeVehicle[], options: Options) => {
    const now = getCurrentEpochSeconds()

    const vehicles = payload.reduce(
        (acc: Record<string, RealtimeVehicle>, vehicle: RealtimeVehicle) => {
            if (
                options.removeExpired &&
                isVehicleExpired(vehicle, options, now)
            ) {
                return acc
            }

            if (
                options.markInactive &&
                isVehicleInactive(vehicle, options, now)
            ) {
                vehicle.active = false
            } else {
                vehicle.active = true
            }

            acc[vehicle.vehicleRef] = vehicle

            return acc
        },
        {},
    )

    return {
        vehicles,
    }
}

const update = (
    state: State,
    vehicles: RealtimeVehicle[],
    options: Options,
) => {
    const now = getCurrentEpochSeconds()

    const updatedVehicles = {
        ...state.vehicles,
    }

    vehicles.forEach((vehicle) => {
        if (options.markInactive && isVehicleInactive(vehicle, options, now)) {
            vehicle.active = false
        } else {
            vehicle.active = true
        }

        if (updatedVehicles[vehicle.vehicleRef]) {
            if (
                vehicle.lastUpdatedEpochSecond >
                updatedVehicles[vehicle.vehicleRef].lastUpdatedEpochSecond
            ) {
                updatedVehicles[vehicle.vehicleRef] = vehicle
            }
        } else {
            updatedVehicles[vehicle.vehicleRef] = vehicle
        }
    })

    return {
        vehicles: updatedVehicles,
    }
}

const sweep = (state: State, options: Options) => {
    const now = getCurrentEpochSeconds()

    const vehicles = Object.values(state.vehicles).reduce(
        (acc: Record<string, RealtimeVehicle>, vehicle: RealtimeVehicle) => {
            if (
                options.removeExpired &&
                isVehicleExpired(vehicle, options, now)
            ) {
                return acc
            }

            if (
                options.markInactive &&
                isVehicleInactive(vehicle, options, now)
            ) {
                vehicle.active = false
            }

            acc[vehicle.vehicleRef] = vehicle
            return acc
        },
        {},
    )

    return {
        vehicles,
    }
}

const reducerFactory = (options: Options) => (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.HYDRATE:
            return hydrate(action?.payload as RealtimeVehicle[], options)
        case ActionType.UPDATE:
            return update(state, action?.payload as RealtimeVehicle[], options)
        case ActionType.SWEEP:
            return sweep(state, options)
    }
}

const useVehicleReducer = (
    options: Options,
): [{ vehicles: Record<string, RealtimeVehicle> }, Dispatch<Action>] =>
    useReducer(reducerFactory(options), initialState)

export default useVehicleReducer
