import { enums, string, define, is } from 'superstruct'
import { isValid, parse, parseISO } from 'date-fns'
import {
    TransportMode,
    TransportSubmode,
} from 'graphql-generated/journey-planner-v3'
import { Date as JPDate, DateTime } from '../../types/JourneyPlannerV3'

const TransportModeEnumStruct = enums(Object.values(TransportMode))
const TransportSubmodeEnumStruct = enums(Object.values(TransportSubmode))

// Time structs
function isDateTime(str: unknown): str is DateTime {
    return is(str, string()) && isValid(parseISO(str))
}

function isDate(str: unknown): str is JPDate {
    return is(str, string()) && isValid(parse(str, 'yyyy-mm-dd', new Date()))
}

const DateTimeStruct = define<DateTime>('DateTime', isDateTime)
const DateStruct = define<JPDate>('Date', isDate)

export {
    DateStruct,
    DateTimeStruct,
    TransportSubmodeEnumStruct,
    TransportModeEnumStruct,
}
