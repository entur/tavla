import { useReducer } from 'react'

import { Statistics } from '../services/model/statistics'
import { Vehicle } from '../services/model/vehicle'
import { VehicleMapPoint } from '../services/model/vehicleMapPoint'
import { Options } from '../services/model/options'

export type State = {
    vehicles: Record<string, VehicleMapPoint>
    statistics: Statistics
}

export enum ActionType {
    HYDRATE,
    UPDATE,
    SWEEP,
}

export type Action = {
    type: ActionType
    payload?: Vehicle[] | Vehicle
}

const initialState: State = {
    vehicles: {},
    statistics: {
        numberOfVehicles: 0,
        numberOfInactiveVehicles: 0,
        numberOfExpiredVehicles: 0,
        numberOfUpdatesInSession: 0,
    },
}

const DEFAULT_INACTIVE_VEHICLE_IN_SECONDS = 60
const DEFAULT_EXPIRE_VEHICLE_IN_SECONDS = 3600

const getCurrentEpochSeconds = () => Math.floor(Date.now() / 1000)

const isVehicleInactive = (vehicle: Vehicle, options: Options, now: number) =>
    vehicle.lastUpdatedEpochSecond +
        (options?.markInactiveAfterSeconds ||
            DEFAULT_INACTIVE_VEHICLE_IN_SECONDS) <
    now

const isVehicleExpired = (vehicle: Vehicle, options: Options, now: number) =>
    vehicle.lastUpdatedEpochSecond +
        (options?.removeExpiredAfterSeconds ||
            DEFAULT_EXPIRE_VEHICLE_IN_SECONDS) <
        now || vehicle.expirationEpochSecond < now

const hydrate = (state: State, payload: Vehicle[], options: Options) => {
    const now = getCurrentEpochSeconds()
    let numberOfExpiredVehicles = state.statistics.numberOfExpiredVehicles
    let numberOfUpdatesInSession = state.statistics.numberOfUpdatesInSession

    const vehicles = payload.reduce((acc: any, vehicle: Vehicle) => {
        numberOfUpdatesInSession++

        if (options.removeExpired && isVehicleExpired(vehicle, options, now)) {
            numberOfExpiredVehicles++
            return acc
        }
        const vehicleMapPoint: VehicleMapPoint = {
            icon: vehicle.mode.toLowerCase(),
            vehicle,
        }

        if (options.markInactive && isVehicleInactive(vehicle, options, now)) {
            vehicleMapPoint.icon = vehicleMapPoint.icon + '_inactive'
        }

        acc[vehicle.vehicleRef] = vehicleMapPoint

        return acc
    }, {})

    return {
        statistics: {
            numberOfVehicles: Object.values(vehicles).length,
            numberOfInactiveVehicles: Object.values(vehicles).filter(
                (v: any) => v.icon.indexOf('_inactive') > -1,
            ).length,
            numberOfExpiredVehicles,
            numberOfUpdatesInSession,
        },
        vehicles,
    }
}

const update = (state: State, vehicles: Vehicle[], options: Options) => {
    const now = getCurrentEpochSeconds()
    let numberOfExpiredVehicles = state.statistics.numberOfExpiredVehicles
    let numberOfUpdatesInSession = state.statistics.numberOfUpdatesInSession

    const updatedVehicles = {
        ...state.vehicles,
    }

    vehicles.forEach((vehicle) => {
        numberOfUpdatesInSession++
        if (options.removeExpired && isVehicleExpired(vehicle, options, now)) {
            numberOfExpiredVehicles++
        } else {
            const vehicleMapPoint: VehicleMapPoint = {
                icon: vehicle.mode.toLowerCase(),
                vehicle,
            }

            if (
                options.markInactive &&
                isVehicleInactive(vehicle, options, now)
            ) {
                vehicleMapPoint.icon = vehicleMapPoint.icon + '_inactive'
            }

            if (updatedVehicles[vehicle.vehicleRef]) {
                if (
                    vehicle.lastUpdatedEpochSecond >
                    updatedVehicles[vehicle.vehicleRef].vehicle
                        .lastUpdatedEpochSecond
                ) {
                    updatedVehicles[vehicle.vehicleRef] = vehicleMapPoint
                }
            } else {
                updatedVehicles[vehicle.vehicleRef] = vehicleMapPoint
            }
        }
    })

    return {
        statistics: {
            numberOfVehicles: Object.values(updatedVehicles).length,
            numberOfInactiveVehicles: Object.values(updatedVehicles).filter(
                (v: any) => v.icon.indexOf('_inactive') > -1,
            ).length,
            numberOfExpiredVehicles,
            numberOfUpdatesInSession,
        },
        vehicles: updatedVehicles,
    }
}

const sweep = (state: State, options: Options) => {
    const now = getCurrentEpochSeconds()
    let numberOfExpiredVehicles = state.statistics.numberOfExpiredVehicles

    const vehicles = Object.values(state.vehicles).reduce(
        (acc: any, vehicleMapPoint: VehicleMapPoint) => {
            if (
                options.removeExpired &&
                isVehicleExpired(vehicleMapPoint.vehicle, options, now)
            ) {
                numberOfExpiredVehicles++
                return acc
            }

            if (
                options.markInactive &&
                isVehicleInactive(vehicleMapPoint.vehicle, options, now)
            ) {
                if (vehicleMapPoint.icon.indexOf('_inactive') === -1) {
                    vehicleMapPoint.icon = vehicleMapPoint.icon + '_inactive'
                }
            }

            acc[vehicleMapPoint.vehicle.vehicleRef] = vehicleMapPoint
            return acc
        },
        {},
    )

    return {
        vehicles,
        statistics: {
            ...state.statistics,
            numberOfVehicles: Object.values(vehicles).length,
            numberOfInactiveVehicles: Object.values(vehicles).filter(
                (v: any) => v.icon.indexOf('_inactive') > -1,
            ).length,
            numberOfExpiredVehicles,
        },
    }
}

const reducerFactory = (options: Options) => (state: State, action: Action) => {
    switch (action.type) {
        case ActionType.HYDRATE:
            return hydrate(state, action?.payload as Vehicle[], options)
        case ActionType.UPDATE:
            return update(state, action?.payload as Vehicle[], options)
        case ActionType.SWEEP:
            return sweep(state, options)
    }
}

export default function useVehicleReducer(options: Options) {
    return useReducer(reducerFactory(options), initialState)
}
