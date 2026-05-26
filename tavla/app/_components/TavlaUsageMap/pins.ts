export type PinData = {
    index: number
    label: string
    imageSrc: string
    tooltipSide: 'left' | 'right'
    cx: number
    cy: number
}

export const PINS: PinData[] = [
    {
        index: 3,
        label: 'Visit Helgeland',
        imageSrc: '/images/pins/pin-3.png',
        tooltipSide: 'right',
        cx: 246.5,
        cy: 238.6,
    },
    {
        index: 4,
        label: 'Kontor i Bergen',
        imageSrc: '/images/pins/pin-4.png',
        tooltipSide: 'right',
        cx: 62.3,
        cy: 443.0,
    },
    {
        index: 7,
        label: 'Universitetet i Oslo',
        imageSrc: '/images/pins/pin-7.png',
        tooltipSide: 'left',
        cx: 177.7,
        cy: 501.5,
    },
    {
        index: 8,
        label: 'Kongsberg',
        imageSrc: '/images/pins/pin-8.png',
        tooltipSide: 'right',
        cx: 153.1,
        cy: 513.7,
    },
    {
        index: 9,
        label: 'Trondheim Sentralstasjon',
        imageSrc: '/images/pins/pin-9.png',
        tooltipSide: 'right',
        cx: 150.2,
        cy: 378.8,
    },
    {
        index: 10,
        label: 'Moa Trafikkstasjon',
        imageSrc: '/images/pins/pin-10.png',
        tooltipSide: 'right',
        cx: 103.7,
        cy: 395.7,
    },
    {
        index: 12,
        label: 'Giæverbukta bussterminal',
        imageSrc: '/images/pins/pin-12.png',
        tooltipSide: 'right',
        cx: 345.3,
        cy: 93.6,
    },
]
