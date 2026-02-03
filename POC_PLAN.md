# Proof-of-Concept Plan: Add Tiles by Address/POI Search

## Overview
Current flow: Select county → Select stop place → (Optional) Select platform  
**New flow**: Search for address/POI → Select from nearby stop places (200m radius) → (Optional) Select platform

---

## Current Architecture Analysis

### Current TileSelector Flow
- **File**: `tavla/app/(admin)/components/TileSelector/index.tsx`
- **Component**: Uses county selection (MultiSelect) → Stop place selection (SearchableDropdown) → Quay selection (Dropdown)
- **Data sources**:
  - Counties: `fetchCounties()` from Entur API (COUNTY_ENDPOINT)
  - Stop places: `fetchStopPlaces(text, countyIds)` via Entur Geocoder API
  - Quays: `useQuaySearch(stopPlaceId)` via GraphQL query `QuaysSearchQuery`

### Existing Patterns to Reuse

#### `WalkingDistance.tsx` Component
- **Pattern**: Demonstrates how to search for addresses/POIs
- **Hook**: `usePointSearch(location)` 
- **Mechanism**:
  - Uses `fetchPoints(text)` from Entur Geocoder API
  - Returns locations with coordinates: `{ lat, lng }`
  - Wrapped in `SearchableDropdown` for easy selection
- **API Call**: `GEOCODER_ENDPOINT/autocomplete` with generic params (no venue filter)

#### `useStopPlaceSearch` Hook
- Uses `fetchStopPlaces(text, countyIds)` 
- Returns: `NormalizedDropdownItemType<stopPlace>[]` with id and county
- Includes PostHog tracking

#### `useQuaySearch` Hook
- Fetches quays from GraphQL `QuaysSearchQuery`
- Returns dropdown items with platform info (publicCode, description)
- Filters out air transport modes

### Entur APIs Available

1. **Geocoder API** (`GEOCODER_ENDPOINT/autocomplete`)
   - Used for address/POI search
   - No layer filter = generic location search (currently used in WalkingDistance)
   - Returns: coordinates, labels, layer type

2. **GraphQL API** (Journey Planner v3)
   - Query: `stopPlacesByBbox(minimumLatitude, minimumLongitude, maximumLatitude, maximumLongitude, filterByInUse)`
   - Returns: Stop places within a bounding box
   - **Currently generated**: `StopPlaceCoordinatesQuery` exists
   - **Need to add**: `StopPlacesByBboxQuery` for fetching multiple stop places

---

## Implementation Plan

### Phase 1: Add GraphQL Query for Bbox Search

**File to modify**: `tavla/codegen.ts` or manual GraphQL definitions in `tavla/src/graphql/index.ts`

**Query needed**:
```graphql
query stopPlacesByBbox(
  $minLat: Float!
  $minLng: Float!
  $maxLat: Float!
  $maxLng: Float!
) {
  stopPlacesByBbox(
    minimumLatitude: $minLat
    minimumLongitude: $minLng
    maximumLatitude: $maxLat
    maximumLongitude: $maxLng
    filterByInUse: true
  ) {
    id
    name
    latitude
    longitude
    quays(filterByInUse: true) {
      id
      publicCode
      description
      lines {
        id
        publicCode
        name
        transportMode
      }
    }
  }
}
```

**Step**:
1. Add query to GraphQL definitions (or use codegen config)
2. Run `yarn generate` to create TypeScript types
3. Create type aliases: `TStopPlacesByBboxQuery`, `TStopPlacesByBboxQueryVariables`

---

### Phase 2: Create `useStopPlacesByBbox` Hook

**File**: `tavla/app/(admin)/hooks/useStopPlacesByBbox.ts` (new)

**Functionality**:
- Input: `Coordinate { lat, lng }` (from address search)
- Calculate bounding box with 200m radius
- Query GraphQL `stopPlacesByBbox`
- Return: Array of stop places with quays, sorted by distance

**Key details**:
- 200m radius ≈ 0.0018 degrees
- Implement distance calculation: Haversine formula or simple approximation
- Return sorted by distance (nearest first)
- Handle loading/error states
- Consider response structure for reuse

**Returns**:
```typescript
{
  stopPlaces: NormalizedDropdownItemType<stopPlace>[]
  loading: boolean
  error?: Error
}
```

---

### Phase 3: Create `useAddressThenStopPlaces` Hook

**File**: `tavla/app/(admin)/hooks/useAddressThenStopPlaces.ts` (new)

**Composition**:
- Combines `usePointSearch` (address search) + `useStopPlacesByBbox` (radius fetch)
- State flow:
  1. User types → `pointItems` list from `usePointSearch`
  2. User selects address → trigger `useStopPlacesByBbox` with coords
  3. Show `stopPlaceItems` from nearby results
  4. User selects stop place → return selection

**Returns**:
```typescript
{
  // Address search
  pointItems: (search: string) => Promise<NormalizedDropdownItemType<LocationDB>[]>
  selectedPoint: NormalizedDropdownItemType<LocationDB> | null
  setSelectedPoint: (point) => void
  
  // Stop place results
  stopPlaceItems: NormalizedDropdownItemType<stopPlace>[]
  selectedStopPlace: NormalizedDropdownItemType<stopPlace> | null
  setSelectedStopPlace: (place) => void
  
  // Loading states
  loadingStopPlaces: boolean
  errorStopPlaces?: Error
}
```

---

### Phase 4: Create `AddressThenStopPlacesTileSelector` Component

**File**: `tavla/app/(admin)/components/AddressThenStopPlacesTileSelector/index.tsx` (new)

**UI Structure**:
```
[SearchableDropdown] "Søk etter adresse eller POI"
↓ (on selection)
[Dropdown] "Velg stoppested" (populated with nearby stop places, 200m radius)
↓ (optional)
[Dropdown] "Velg plattform/retning"
[Submit Button]
```

**Reuses**:
- `SearchableDropdown` from TileSelector (address search)
- `Dropdown` for stop place selection
- `useQuaySearch` hook (for platform selection)
- HiddenInput components for form submission
- Form error handling patterns from TileSelector

**Enhancements**:
- Show distance to each stop place in label: "Stop Name (150m)"
- Loading indicator while fetching nearby stops
- Empty state if no stops found within radius
- PostHog tracking events similar to TileSelector

---

### Phase 5: Create POC Demo/Test Component

**File**: `tavla/app/(admin)/components/AddressThenStopPlacesTileSelector/demo.tsx` (or add to a test page)

**Purpose**:
- Standalone component to test the flow without integrating into full form
- Verify data fetching, UI responsiveness, edge cases
- Test with different addresses (rural vs urban)

**Testing points**:
1. Address search returns results
2. Nearby stops fetch correctly
3. Distance calculation is reasonable
4. No stops found edge case (rural areas)
5. Stop place selection propagates correctly
6. Quay selection works as expected

---

## Key Technical Decisions

### Distance Calculation
- **Simple approach**: Calculate bounding box (±0.0018° ≈ 200m)
- **Better approach**: Haversine formula to calculate actual distances
- **Recommendation**: Use Haversine for accuracy, sort results by distance

### 200m Radius Rationale
- Typical urban block is 100-150m
- Walking speed ≈ 1.4 m/s, so 200m ≈ 2.5 min walk
- User expectation: "nearby" = within a few minute's walk

### Response Structure
- Keep `NormalizedDropdownItemType<stopPlace>` consistent with TileSelector
- Extend labels with distance: e.g., "Oslo S (180m)"
- Store full stop place data (id, coordinates) for later use

### Loading States
- Show spinner while fetching bbox stop places
- Disable dropdown until fetch complete
- Clear error messages on new search

---

## GraphQL Integration

### Existing Queries to Reference
- **QuaysSearchQuery**: Fetches quays for a stop place
  ```typescript
  query quaysSearch($stopPlaceId: String!) {
    stopPlace(id: $stopPlaceId) {
      quays(filterByInUse: true) { ... }
    }
  }
  ```
- **StopPlaceCoordinatesQuery**: Fetches stop place coordinates
  ```typescript
  query stopPlaceCoordinates($id: String!) {
    stopPlace(id: $id) { id longitude latitude }
  }
  ```

### New Query to Add
- **StopPlacesByBboxQuery**: Fetch stop places in bounding box
- Location: `tavla/src/graphql/index.ts` (or generated via codegen)

---

## API Flow Diagram

```
User Input (Address)
    ↓
[usePointSearch] → GEOCODER_ENDPOINT/autocomplete
    ↓
[User selects address + gets coordinates]
    ↓
[useStopPlacesByBbox] → Calculate bbox → GraphQL stopPlacesByBbox
    ↓
[Sort by distance, format with distance labels]
    ↓
[User selects stop place]
    ↓
[useQuaySearch] → GraphQL quaysSearch
    ↓
[User selects quay (optional)]
    ↓
Form submission with: stop_place_id, quay_id
```

---

## Files to Create/Modify

### New Files
- `tavla/app/(admin)/hooks/useStopPlacesByBbox.ts`
- `tavla/app/(admin)/hooks/useAddressThenStopPlaces.ts`
- `tavla/app/(admin)/components/AddressThenStopPlacesTileSelector/index.tsx`
- `tavla/app/(admin)/components/AddressThenStopPlacesTileSelector/utils.ts` (optional, for distance calc)

### Modify Existing Files
- `tavla/src/graphql/index.ts` (add StopPlacesByBboxQuery)
- `tavla/codegen.ts` (optional, if using codegen)

### Test/Demo
- Optional: `tavla/app/(admin)/components/AddressThenStopPlacesTileSelector/demo.tsx`
- Optional: Test page in app

---

## Success Criteria for POC

✅ User can search for an address/POI using a searchable dropdown  
✅ After selecting an address, nearby stop places (within 200m) are fetched and displayed  
✅ User can select one of the nearby stop places  
✅ User can optionally select a platform/quay  
✅ Form submission includes all selected data  
✅ Loading states and error handling are visible  
✅ Distance is calculated and shown to user  
✅ Works in both urban and rural contexts (or handles gracefully)  

---

## Assumptions & Risks

### Assumptions
- Entur GraphQL API supports `stopPlacesByBbox` query (confirmed in schema)
- Coordinates from geocoder are accurate
- 200m radius is sufficient for typical use cases

### Risks
- **Performance**: Fetching all stop places in bbox might return many results in dense areas
  - Mitigation: Limit results to top 10-20 by distance, add pagination if needed
- **Rural areas**: 200m radius might return 0 results
  - Mitigation: Gracefully show "no results, try expanding search or use direct search"
- **Coordinate accuracy**: Geocoder might return slightly inaccurate coordinates
  - Mitigation: Display distance to help user verify

---

## Next Steps (After POC)

1. **Integration**: Add as alternative selection mode in TileSelector (with toggle or new flow)
2. **UX refinement**: A/B test different distance thresholds
3. **Performance**: Implement pagination/virtualization if needed for large result sets
4. **Analytics**: Track user preferences (address-based vs. county-based tile selection)
5. **Mobile**: Ensure responsive design works on mobile (currently might be desktop-focused)
