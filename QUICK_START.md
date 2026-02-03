# Quick Start: Address-Based Tile Selector POC

## 🚀 Getting Started

### Prerequisites
- Node.js and Yarn installed
- Running the tavla frontend: `yarn dev:persist` (from `tavla/` directory)

### Access the POC

Navigate to: **`http://localhost:3000/admin/address-search-demo`**

---

## 📍 Testing Workflow

### Step 1: Search for an Address
1. Type "Oslo" in the first dropdown
2. Wait for autocomplete results (150ms debounce)
3. Select a location (e.g., "Tøyen", "Oslo Station", "Ferner Brydne")

### Step 2: Select a Nearby Stop Place
1. After selecting an address, the second dropdown will load
2. See a list of stop places within 200m radius
3. Each entry shows distance in parentheses, e.g., "Oslo S (150m)"
4. Select one of the nearby stops

### Step 3: Choose a Platform (Optional)
1. After selecting a stop place, the third dropdown will appear
2. Shows available platforms/directions for that stop
3. Selection is optional - you can skip this

### Step 4: Submit
1. Click "Legg til" (Add) button
2. Open browser DevTools Console (F12)
3. See the logged form data:
   - `stop_place`: Stop place ID
   - `stop_place_name`: Stop place name
   - `quay`: Selected quay ID (if chosen)
   - `quay_name`: Selected quay name (if chosen)
   - `county`: County code

---

## 🧪 Test Scenarios

### Scenario 1: Urban Area (Many Stops)
- Search for: "Oslo", "Bergen", "Trondheim"
- Expected: 5-10 stop places within 200m
- Verify: Distance ordering (nearest first)

### Scenario 2: Station/Terminal
- Search for: "Oslo Central", "Bergen Station", "Stavanger Station"
- Expected: Multiple stops at same location
- Verify: All stops shown with accurate distances

### Scenario 3: Rural Area (Few/No Stops)
- Search for: "Raufoss", "Notodden", small town names
- Expected: 0-2 stop places
- Verify: Empty state message appears: "Ingen stoppesteder funnet innenfor 200m radius"

### Scenario 4: POI (Point of Interest)
- Search for: "Tåsen", "Bislett", "Fener", neighborhood names
- Expected: Stop places near that area
- Verify: Distances make sense for the location

---

## 🐛 Debugging

### Check Coordinates
Open browser DevTools Console and search for an address. The coordinate will be used to fetch nearby stops.

### Check Distance Calculations
Use the browser console to test distance calculation:
```javascript
// Example: Calculate distance between two coordinates
const R = 6371e3; // Earth's radius in meters
const toRad = Math.PI / 180;
const lat1 = 59.9139 * toRad; // Oslo
const lng1 = 10.7522 * toRad;
const lat2 = 59.9074 * toRad; // Nearby location
const lng2 = 10.7600 * toRad;
const Δφ = (lat2 - lat1);
const Δλ = (lng2 - lng1);
const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) + 
          Math.cos(lat1) * Math.cos(lat2) * Math.sin(Δλ/2) * Math.sin(Δλ/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const d = R * c; // Distance in meters
console.log(d);
```

### Common Issues

**No stops appear after selecting address**
- Check if the selected address actually has stops nearby
- Try a different address (e.g., "Oslo S" instead of "Oslo")
- Check browser DevTools Network tab for GraphQL query response

**Distances seem wrong**
- Verify the coordinates format is {lat, lng}
- Check that Entur API is returning valid coordinates
- Ensure distance formatting is correct (150m, 1.2km)

**Form doesn't submit**
- Make sure a stop place is selected (yellow warning should appear)
- Check browser console for any JavaScript errors

---

## 📊 Expected Data Structure

### Address/POI Object (LocationDB)
```typescript
{
  name: "Tøyen, Oslo",
  coordinate: {
    lat: 59.9139,
    lng: 10.7522
  }
}
```

### Stop Place Object
```typescript
{
  value: {
    id: "NSR:StopPlace:36001", // Entur stop place ID
    county: "030" // County code
  },
  label: "Oslo S (150m)" // With distance
}
```

### Form Submission Data
```
{
  stop_place: "NSR:StopPlace:36001",
  stop_place_name: "Oslo S",
  quay: "NSR:Quay:36001:1", // Optional
  quay_name: "Plattform 1", // Optional
  county: "030"
}
```

---

## 🎯 What to Verify

- [ ] Address search works with 3+ characters
- [ ] Stop places load within 2-3 seconds
- [ ] Distances are displayed in dropdown labels
- [ ] Stops are sorted by distance (nearest first)
- [ ] "No results" message shows when no stops within 200m
- [ ] Loading state visible while fetching
- [ ] Platform selection works (conditional render)
- [ ] Form submission logs correct data
- [ ] Responsive on different screen sizes
- [ ] Works in Chrome, Firefox, Safari

---

## 🔗 Important Files

- **Demo Page**: `app/(admin)/address-search-demo/page.tsx`
- **Component**: `app/(admin)/components/AddressThenStopPlacesTileSelector/index.tsx`
- **Main Hook**: `app/(admin)/hooks/useAddressThenStopPlaces.ts`
- **Distance Hook**: `app/(admin)/hooks/useStopPlacesByBbox.ts`
- **Distance Utils**: `app/(admin)/hooks/distanceUtils.ts`
- **GraphQL Query**: `src/graphql/queries/stopPlacesByBbox.graphql`

---

## 📚 Documentation

- **POC_PLAN.md**: Detailed planning and architecture
- **IMPLEMENTATION_SUMMARY.md**: Complete feature overview
- **IMPLEMENTATION_CHECKLIST.md**: What was built
- **This file (QUICK_START.md)**: Testing guide

---

## ✅ Success Criteria

POC is successful when:
1. Address search returns relevant results
2. Stop places within 200m are fetched correctly
3. Distances are calculated accurately
4. Form submission includes all selected data
5. Loading/error states are visible
6. Works with both urban and rural locations

---

**Ready to test?** Start at: `http://localhost:3000/admin/address-search-demo`

For questions, check the detailed docs or review the implementation in the files listed above.
