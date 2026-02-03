# Implementation Summary: Address-Based Tile Selector POC

## ✅ Completed Tasks

### 1. GraphQL Query (`stopPlacesByBbox.graphql`)
- **Location**: `tavla/src/graphql/queries/stopPlacesByBbox.graphql`
- **Purpose**: Fetch stop places within a bounding box with coordinates, quays, and lines
- **Generated types**: `TStopPlacesByBboxQuery`, `TStopPlacesByBboxQueryVariables`

### 2. Distance Utilities (`distanceUtils.ts`)
- **Location**: `tavla/app/(admin)/hooks/distanceUtils.ts`
- **Functions**:
  - `calculateDistance()`: Haversine formula for accurate distance calculation
  - `calculateBoundingBox()`: Convert radius to lat/lng bounds
  - `sortByDistance()`: Sort stop places by distance
  - `formatDistance()`: Format distance (e.g., "150m", "1.2km")
- **Tests**: Used in useStopPlacesByBbox hook

### 3. useStopPlacesByBbox Hook
- **Location**: `tavla/app/(admin)/hooks/useStopPlacesByBbox.ts`
- **Features**:
  - Fetches stop places within radius of a coordinate (default 200m)
  - Uses GraphQL `StopPlacesByBboxQuery`
  - Sorts results by distance
  - Returns dropdown items with distance in label: "Stop Name (150m)"
  - Handles loading/error states
- **Exports**: `{ stopPlaces, loading, error }`

### 4. useAddressThenStopPlaces Hook
- **Location**: `tavla/app/(admin)/hooks/useAddressThenStopPlaces.ts`
- **Features**:
  - Combines `usePointSearch` (address search) + `useStopPlacesByBbox` (radius fetch)
  - Orchestrates the full workflow
  - Resets selected stop place when address changes
  - Default radius: 200m
- **Exports**: Address search state + stop place search state + loading flags

### 5. AddressThenStopPlacesTileSelector Component
- **Location**: `tavla/app/(admin)/components/AddressThenStopPlacesTileSelector/index.tsx`
- **UI Flow**:
  1. SearchableDropdown for address/POI search
  2. Dropdown for nearby stop places (shows only after address selected)
  3. Dropdown for platform/quay selection (shows only after stop place selected)
  4. Form submission with all selected data
- **Features**:
  - Loading indicator while fetching stops
  - Empty state message for "no stops found"
  - Distance displayed in stop place labels
  - PostHog event tracking
  - Reuses HiddenInput and SubmitButton components
  - ClientOnly wrapper for search dropdown

### 6. POC Demo Page
- **Location**: `tavla/app/(admin)/address-search-demo/page.tsx`
- **Access**: Navigate to `/admin/address-search-demo`
- **Features**:
  - Standalone demo of the component
  - Form logs data to browser console on submit
  - Instructions and dev notes
  - Can be used to test the feature before integration

---

## 📁 File Structure

```
tavla/
├── app/(admin)/
│   ├── hooks/
│   │   ├── distanceUtils.ts           [NEW] Distance calculation utilities
│   │   ├── useStopPlacesByBbox.ts     [NEW] Fetch stops by bbox hook
│   │   ├── useAddressThenStopPlaces.ts [NEW] Combined search hook
│   │   └── ...
│   ├── components/
│   │   ├── AddressThenStopPlacesTileSelector/
│   │   │   └── index.tsx              [NEW] Component
│   │   └── ...
│   └── address-search-demo/
│       └── page.tsx                   [NEW] Demo page
├── src/
│   ├── graphql/
│   │   ├── queries/
│   │   │   ├── stopPlacesByBbox.graphql [NEW] GraphQL query
│   │   │   └── ...
│   │   └── index.ts                   [MODIFIED] Generated types
│   └── ...
└── ...
```

---

## 🎯 How to Test

### Option 1: Use Demo Page
1. Start the app: `yarn dev:persist` (from `tavla/`)
2. Navigate to: `http://localhost:3000/admin/address-search-demo`
3. Search for addresses like "Oslo", "Bergen", "Oslo S", "Tøyen", etc.
4. Select an address to see nearby stops (within 200m)
5. Open browser DevTools Console to see logged form data

### Option 2: Integrate into Main Flow (Future)
The component can be swapped in place of existing TileSelector:
```tsx
// Instead of:
<TileSelector action={handleSubmit} />

// Use:
<AddressThenStopPlacesTileSelector action={handleSubmit} />
```

---

## 🚀 Key Features

### User Experience
- ✅ Search for addresses/POIs (Entur Geocoder API)
- ✅ See nearby stop places with distance labels
- ✅ Distance calculated accurately using Haversine formula
- ✅ Loading states while fetching data
- ✅ Empty state handling (no stops within radius)
- ✅ Optional platform selection
- ✅ Form validation (requires stop place selection)

### Technical
- ✅ Uses existing Entur GraphQL APIs
- ✅ Reuses existing components and hooks
- ✅ Proper TypeScript typing
- ✅ PostHog event tracking
- ✅ ClientOnly wrapper for client-only features
- ✅ Responsive design (flex layout)
- ✅ Accessibility ARIA attributes

---

## 📊 Data Flow

```
User Types Address
    ↓
usePointSearch (SearchableDropdown)
    ↓
[User selects address + coordinates extracted]
    ↓
useStopPlacesByBbox triggered with coordinates
    ↓
calculateBoundingBox(coords, 200m)
    ↓
GraphQL Query: stopPlacesByBbox(minLat, minLng, maxLat, maxLng)
    ↓
[Results returned with coordinates]
    ↓
sortByDistance + calculateDistance (Haversine formula)
    ↓
formatDistance for display
    ↓
[Dropdown populated with "Name (distance)"]
    ↓
User selects stop place
    ↓
useQuaySearch fetches quays for stop place (if needed)
    ↓
[Optional platform selection]
    ↓
Form submission with stop_place_id, quay_id, county
```

---

## 🔧 Configuration

### Distance Radius
Default: 200m (can be customized per hook call)
```tsx
useStopPlacesByBbox(center, 300) // 300m radius
useAddressThenStopPlaces(500)     // 500m radius
```

### PostHog Events
Events tracked:
- `stop_place_add_interaction` - User interactions with dropdowns
- `stop_place_added` - Form submission
- `survey_set_up_board` - Post-submit survey

---

## ✨ Next Steps

### For POC Validation
1. Test with various addresses across Norway
2. Verify distance calculations
3. Check performance with dense city areas
4. Test rural areas (0 results scenario)
5. Validate form submission

### For Production Integration
1. Add to main `/admin/tavler/[id]/rediger` flow
2. Option to toggle between old (county) and new (address) flow
3. A/B test user preference
4. Analytics on which approach users prefer
5. Consider mobile UX (currently optimized for desktop)
6. Add accessibility testing

### Potential Enhancements
- Filter by transport mode
- Customize distance threshold per user
- Save recently searched addresses
- Integration with user location (geolocation API)
- Autocomplete based on popular locations
- Support for multiple language search

---

## 📝 Notes

- The component uses the same form field names as the original TileSelector
- Compatible with existing form submission handlers
- All distance calculations use WGS84 coordinates (standard for maps)
- Haversine formula accurate within ~0.5% for typical distances
- GraphQL query is auto-generated via codegen

---

## 🐛 Troubleshooting

### No stop places found
- Check if 200m radius is appropriate for the location (very rural areas might have no stops)
- Try expanding radius in the hook configuration
- Verify the geocoded coordinates are correct

### Distances seem incorrect
- Check that LocationDB coordinate format is {lat, lng}
- Verify Entur API is returning valid coordinates
- Run calculateDistance with known test coordinates

### GraphQL query errors
- Ensure `stopPlacesByBbox` is available in your Entur API endpoint
- Check that the bounding box parameters are numbers
- Verify GraphQL schema is up to date (run `yarn generate`)

---

Generated: 2 February 2026
POC Status: ✅ Complete and Ready for Testing
