declare global {
    /**
     * List of coordinates like: [[60.89, 11.12], [62.56, 12.10]]
     */
    type Coordinates = [[number, number]]

    /**
     * Local date using the ISO 8601 format: YYYY-MM-DD. Example: 2020-05-17.
     */
    type Date = string

    /**
     * DateTime format accepting ISO 8601 dates with time zone offset.
     * Format: YYYY-MM-DD'T'hh:mm[:ss](Z|±01:00)
     * Example: 2017-04-23T18:25:43+02:00 or 2017-04-23T16:25:43Z
     */
    type DateTime = string

    /**
     * Time using the format: HH:mm:SS. Example: 18:25:SS
     */
    type LocalTime = string

    /**
     * Time using the format: HH:MM:SS. Example: 18:25:43
     */
    type Time = string

    /**
     * A 64-bit signed integer
     */
    type Long = number

    /**
     * A linear function to calculate a value(y) based on a parameter (x): y = f(x) = a + bx.
     * It allows setting both a constant(a) and a coefficient(b) and the use those in the computation.
     * Format: a + b x. Example: 1800 + 2.0 x
     */
    type DoubleFunction = string

    /**
     * Duration in a lenient ISO-8601 duration format. Example P2DT2H12M40S, 2d2h12m40s or 1h
     */
    type Duration = string
}

export type {
    Coordinates,
    Date,
    DateTime,
    DoubleFunction,
    Duration,
    LocalTime,
    Long,
    Time,
}
