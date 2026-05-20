export type PinData = {
    id: string
    label: string
    imageSrc: string
    interactive: boolean
    tooltipSide: 'left' | 'right'
    cx: number
    cy: number
}

// SVG viewBox: 0 0 730 688
// Coordinates are center points of each pin shape
export const PINS: PinData[] = [
    {
        id: 'pin-0',
        label: 'Pin 0',
        imageSrc: '/images/pins/placeholder.jpg',
        interactive: false,
        tooltipSide: 'right',
        cx: 643.3,
        cy: 63.7,
    },
    {
        id: 'pin-1',
        label: 'Pin 1',
        imageSrc: '/images/pins/placeholder.jpg',
        interactive: false,
        tooltipSide: 'right',
        cx: 404.3,
        cy: 175.7,
    },
    {
        id: 'pin-2',
        label: 'Pin 2',
        imageSrc: '/images/pins/placeholder.jpg',
        interactive: false,
        tooltipSide: 'right',
        cx: 308.7,
        cy: 182.6,
    },
    {
        id: 'pin-3',
        label: 'Visit Helgeland',
        imageSrc: '/images/pins/pin-3.png',
        interactive: true,
        tooltipSide: 'right',
        cx: 291.7,
        cy: 282.6,
    },
    {
        id: 'pin-4',
        label: 'Kontor i Bergen',
        imageSrc: '/images/pins/pin-4.png',
        interactive: true,
        tooltipSide: 'right',
        cx: 73.7,
        cy: 524.6,
    },
    {
        id: 'pin-5',
        label: 'Pin 5',
        imageSrc: '/images/pins/placeholder.jpg',
        interactive: false,
        tooltipSide: 'right',
        cx: 128.3,
        cy: 652.6,
    },
    {
        id: 'pin-6',
        label: 'Pin 6',
        imageSrc: '/images/pins/placeholder.jpg',
        interactive: false,
        tooltipSide: 'right',
        cx: 196.8,
        cy: 517.6,
    },
    {
        id: 'pin-7',
        label: 'Universitetet i Oslo',
        imageSrc: '/images/pins/pin-7.png',
        interactive: true,
        tooltipSide: 'left',
        cx: 210.3,
        cy: 593.8,
    },
    {
        id: 'pin-8',
        label: 'Kongsberg',
        imageSrc: '/images/pins/pin-8.png',
        interactive: true,
        tooltipSide: 'right',
        cx: 181.1,
        cy: 608.3,
    },
    {
        id: 'pin-9',
        label: 'Trondheim Sentralstasjon',
        imageSrc: '/images/pins/pin-9.png',
        interactive: true,
        tooltipSide: 'right',
        cx: 177.7,
        cy: 448.6,
    },
    {
        id: 'pin-10',
        label: 'Moa Trafikkstasjon',
        imageSrc: '/images/pins/pin-10.png',
        interactive: true,
        tooltipSide: 'right',
        cx: 122.7,
        cy: 468.6,
    },
    {
        id: 'pin-11',
        label: 'Pin 11',
        imageSrc: '/images/pins/placeholder.jpg',
        interactive: false,
        tooltipSide: 'right',
        cx: 530.3,
        cy: 143.7,
    },
    {
        id: 'pin-12',
        label: 'Giæverbukta bussterminal',
        imageSrc: '/images/pins/pin-12.png',
        interactive: true,
        tooltipSide: 'right',
        cx: 408.5,
        cy: 110.8,
    },
]
