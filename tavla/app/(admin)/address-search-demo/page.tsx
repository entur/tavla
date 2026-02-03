'use client'
import { Heading3 } from '@entur/typography'
import { AddressThenStopPlacesTileSelector } from 'app/(admin)/components/AddressThenStopPlacesTileSelector'

/**
 * Demo page for the AddressThenStopPlacesTileSelector POC
 * Navigate to /admin/address-search-demo to test the new flow
 */
export default function AddressSearchDemoPage() {
    const handleSubmit = async (formData: FormData) => {
        // eslint-disable-next-line no-console
        console.log('Form submitted with data:')
        // eslint-disable-next-line no-console
        console.log('stop_place:', formData.get('stop_place'))
        // eslint-disable-next-line no-console
        console.log('stop_place_name:', formData.get('stop_place_name'))
        // eslint-disable-next-line no-console
        console.log('quay:', formData.get('quay'))
        // eslint-disable-next-line no-console
        console.log('quay_name:', formData.get('quay_name'))
        // eslint-disable-next-line no-console
        console.log('county:', formData.get('county'))
    }

    return (
        <div className="min-h-screen bg-white p-8">
            <div className="mx-auto max-w-2xl">
                <Heading3 margin="bottom">Address Search POC Demo</Heading3>

                <p className="mb-6 text-gray-600">
                    This is a proof-of-concept for the new tile selector flow:
                </p>

                <ol className="mb-8 ml-4 list-decimal space-y-2 text-gray-700">
                    <li>Search for an address or point of interest</li>
                    <li>
                        Select from stop places within 200m radius (distance
                        shown in parentheses)
                    </li>
                    <li>Optionally select a specific platform/direction</li>
                    <li>Submit to add tile to board</li>
                </ol>

                <div className="rounded border border-gray-200 bg-gray-50 p-6">
                    <AddressThenStopPlacesTileSelector
                        action={handleSubmit}
                        trackingLocation="demo_page"
                    />
                </div>

                <div className="bg-blue-50 mt-8 rounded p-4">
                    <h3 className="text-blue-900 mb-2 font-semibold">
                        Dev Notes
                    </h3>
                    <ul className="text-blue-800 space-y-1 text-sm">
                        <li>• Check browser console for form data on submit</li>
                        <li>
                            • Search for &quot;Oslo&quot;, &quot;Bergen&quot;,
                            etc. to test
                        </li>
                        <li>
                            • Distance is calculated using Haversine formula
                        </li>
                        <li>
                            • Stops are fetched via GraphQL stopPlacesByBbox
                            query
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}
