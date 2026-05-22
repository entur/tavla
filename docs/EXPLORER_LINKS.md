# GraphQL Explorer-lenker — Journey Planner v3

Alle spørringene Tavla bruker mot [Journey Planner v3](https://api.entur.io/journey-planner/v3/graphql), samlet med fragmentene de trenger, klare til å kjøres direkte i [GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3).

> **Eksempelvariabler** bruker realistiske NSR-IDer:
> - `NSR:StopPlace:59872` → Oslo S
> - `NSR:StopPlace:6013` → Bergen stasjon
> - `NSR:Quay:107371` → Oslo S, plattform 1

---

## `quaysSearch`

**Kildefil:** [`tavla/src/graphql/queries/quaySearch.graphql`](../tavla/src/graphql/queries/quaySearch.graphql)

**Beskrivelse:** Henter alle perronger (quays) for et stoppested, med linjer per perrong. Brukes i søk/redigeringsvisning.

**Fragmenter:** `lines`

**Eksempelvariabler:**
```json
{
  "stopPlaceId": "NSR:StopPlace:59872"
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20quaysSearch%28%24stopPlaceId%3A%20String%21%29%20%7B%0A%20%20%20%20stopPlace%28id%3A%20%24stopPlaceId%29%20%7B%0A%20%20%20%20%20%20%20%20quays%28filterByInUse%3A%20true%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%20%20%20%20%20%20stopPlace%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%0A%20%20%20%20%20%20%20%20%20%20%20%20...lines%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20lines%20on%20Quay%20%7B%0A%20%20%20%20lines%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20transportSubmode%0A%20%20%20%20%7D%0A%7D&operationName=quaysSearch&variables=%7B%22stopPlaceId%22%3A%22NSR%3AStopPlace%3A59872%22%7D)**

---

## `getQuay`

**Kildefil:** [`tavla/src/graphql/queries/quay.graphql`](../tavla/src/graphql/queries/quay.graphql)

**Beskrivelse:** Henter avganger, linjer og driftsavvik for én enkelt perrong. Kjernen i avgangstavla for quay-tavler.

**Fragmenter:** `lines`, `departure`, `situation`

**Eksempelvariabler:**
```json
{
  "quayId": "NSR:Quay:107371",
  "numberOfDepartures": 20
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20getQuay%28%0A%20%20%20%20%24quayId%3A%20String%21%0A%20%20%20%20%24whitelistedTransportModes%3A%20%5BTransportMode%5D%0A%20%20%20%20%24whitelistedLines%3A%20%5BID%21%5D%0A%20%20%20%20%24numberOfDepartures%3A%20Int%20%3D%2020%0A%20%20%20%20%24startTime%3A%20DateTime%0A%29%20%7B%0A%20%20%20%20quay%28id%3A%20%24quayId%29%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20...lines%0A%20%20%20%20%20%20%20%20estimatedCalls%28%0A%20%20%20%20%20%20%20%20%20%20%20%20numberOfDepartures%3A%20%24numberOfDepartures%0A%20%20%20%20%20%20%20%20%20%20%20%20whiteListedModes%3A%20%24whitelistedTransportModes%0A%20%20%20%20%20%20%20%20%20%20%20%20whiteListed%3A%20%7B%20lines%3A%20%24whitelistedLines%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20includeCancelledTrips%3A%20true%0A%20%20%20%20%20%20%20%20%20%20%20%20startTime%3A%20%24startTime%0A%20%20%20%20%20%20%20%20%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20...departure%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20...situation%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20lines%20on%20Quay%20%7B%0A%20%20%20%20lines%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20transportSubmode%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20departure%20on%20EstimatedCall%20%7B%0A%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20destinationDisplay%20%7B%0A%20%20%20%20%20%20%20%20frontText%0A%20%20%20%20%20%20%20%20via%0A%20%20%20%20%7D%0A%20%20%20%20aimedDepartureTime%0A%20%20%20%20expectedDepartureTime%0A%20%20%20%20expectedArrivalTime%0A%20%20%20%20serviceJourney%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20transportSubmode%0A%20%20%20%20%20%20%20%20line%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20%20%20%20%20presentation%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20textColour%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20colour%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20cancellation%0A%20%20%20%20realtime%0A%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20%20%20...situation%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20situation%20on%20PtSituationElement%20%7B%0A%20%20%20%20id%0A%20%20%20%20description%20%7B%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20language%0A%20%20%20%20%7D%0A%20%20%20%20summary%20%7B%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20language%0A%20%20%20%20%7D%0A%7D&operationName=getQuay&variables=%7B%22quayId%22%3A%22NSR%3AQuay%3A107371%22%2C%22numberOfDepartures%22%3A20%7D)**

---

## `stopPlaceEdit`

**Kildefil:** [`tavla/src/graphql/queries/stopPlaceEdit.graphql`](../tavla/src/graphql/queries/stopPlaceEdit.graphql)

**Beskrivelse:** Henter stoppestedets perronger med linjer for bruk i redigeringspanelet.

**Fragmenter:** `lines`

**Eksempelvariabler:**
```json
{
  "placeId": "NSR:StopPlace:59872"
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20stopPlaceEdit%28%24placeId%3A%20String%21%29%20%7B%0A%20%20%20%20stopPlace%28id%3A%20%24placeId%29%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20quays%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%20%20%20%20%20%20stopPlace%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20...lines%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20lines%20on%20Quay%20%7B%0A%20%20%20%20lines%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20transportSubmode%0A%20%20%20%20%7D%0A%7D&operationName=stopPlaceEdit&variables=%7B%22placeId%22%3A%22NSR%3AStopPlace%3A59872%22%7D)**

---

## `quayCoordinates`

**Kildefil:** [`tavla/src/graphql/queries/quayCoordinates.graphql`](../tavla/src/graphql/queries/quayCoordinates.graphql)

**Beskrivelse:** Henter geografiske koordinater for én perrong. Brukes til kartvisning og gangavstandsberegning.

**Fragmenter:** ingen

**Eksempelvariabler:**
```json
{
  "id": "NSR:Quay:107371"
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20quayCoordinates%28%24id%3A%20String%21%29%20%7B%0A%20%20%20%20quay%28id%3A%20%24id%29%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20longitude%0A%20%20%20%20%20%20%20%20latitude%0A%20%20%20%20%7D%0A%7D&operationName=quayCoordinates&variables=%7B%22id%22%3A%22NSR%3AQuay%3A107371%22%7D)**

---

## `StopPlace`

**Kildefil:** [`tavla/src/graphql/queries/stopPlace.graphql`](../tavla/src/graphql/queries/stopPlace.graphql)

**Beskrivelse:** Henter avganger og driftsavvik for et helt stoppested. Kjernen i avgangstavla for stopPlace-tavler.

**Fragmenter:** `departure`, `situation`

**Eksempelvariabler:**
```json
{
  "stopPlaceId": "NSR:StopPlace:59872",
  "numberOfDepartures": 20
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20StopPlace%28%0A%20%20%20%20%24stopPlaceId%3A%20String%21%0A%20%20%20%20%24whitelistedTransportModes%3A%20%5BTransportMode%5D%0A%20%20%20%20%24whitelistedLines%3A%20%5BID%21%5D%0A%20%20%20%20%24numberOfDepartures%3A%20Int%20%3D%2020%0A%20%20%20%20%24startTime%3A%20DateTime%0A%29%20%7B%0A%20%20%20%20stopPlace%28id%3A%20%24stopPlaceId%29%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20estimatedCalls%28%0A%20%20%20%20%20%20%20%20%20%20%20%20numberOfDepartures%3A%20%24numberOfDepartures%0A%20%20%20%20%20%20%20%20%20%20%20%20whiteListedModes%3A%20%24whitelistedTransportModes%0A%20%20%20%20%20%20%20%20%20%20%20%20whiteListed%3A%20%7B%20lines%3A%20%24whitelistedLines%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20includeCancelledTrips%3A%20true%0A%20%20%20%20%20%20%20%20%20%20%20%20startTime%3A%20%24startTime%0A%20%20%20%20%20%20%20%20%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20...departure%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20...situation%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20departure%20on%20EstimatedCall%20%7B%0A%20%20%20%20quay%20%7B%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%7D%0A%20%20%20%20destinationDisplay%20%7B%0A%20%20%20%20%20%20%20%20frontText%0A%20%20%20%20%20%20%20%20via%0A%20%20%20%20%7D%0A%20%20%20%20aimedDepartureTime%0A%20%20%20%20expectedDepartureTime%0A%20%20%20%20expectedArrivalTime%0A%20%20%20%20serviceJourney%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20transportSubmode%0A%20%20%20%20%20%20%20%20line%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20%20%20%20%20presentation%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20textColour%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20colour%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%20%20%20%20cancellation%0A%20%20%20%20realtime%0A%20%20%20%20situations%20%7B%0A%20%20%20%20%20%20%20%20...situation%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20situation%20on%20PtSituationElement%20%7B%0A%20%20%20%20id%0A%20%20%20%20description%20%7B%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20language%0A%20%20%20%20%7D%0A%20%20%20%20summary%20%7B%0A%20%20%20%20%20%20%20%20value%0A%20%20%20%20%20%20%20%20language%0A%20%20%20%20%7D%0A%7D&operationName=StopPlace&variables=%7B%22stopPlaceId%22%3A%22NSR%3AStopPlace%3A59872%22%2C%22numberOfDepartures%22%3A20%7D)**

---

## `walkDistance`

**Kildefil:** [`tavla/src/graphql/queries/walkingDistance.graphql`](../tavla/src/graphql/queries/walkingDistance.graphql)

**Beskrivelse:** Beregner gangavstand og reisetid mellom to koordinater via Journey Planner.

**Fragmenter:** ingen

**Eksempelvariabler:**
```json
{
  "from": {
    "latitude": 59.9127,
    "longitude": 10.7461
  },
  "to": {
    "latitude": 59.9139,
    "longitude": 10.7522
  }
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20walkDistance%28%24from%3A%20InputCoordinates%21%2C%20%24to%3A%20InputCoordinates%21%29%20%7B%0A%20%20%20%20trip%28%0A%20%20%20%20%20%20%20%20from%3A%20%7B%20coordinates%3A%20%24from%20%7D%0A%20%20%20%20%20%20%20%20to%3A%20%7B%20coordinates%3A%20%24to%20%7D%0A%20%20%20%20%20%20%20%20modes%3A%20%7B%20directMode%3A%20foot%2C%20transportModes%3A%20%5B%5D%20%7D%0A%20%20%20%20%29%20%7B%0A%20%20%20%20%20%20%20%20tripPatterns%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20duration%0A%20%20%20%20%20%20%20%20%20%20%20%20streetDistance%0A%20%20%20%20%20%20%20%20%20%20%20%20legs%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20expectedStartTime%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20expectedEndTime%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20mode%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20distance%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20line%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D&operationName=walkDistance&variables=%7B%22from%22%3A%7B%22latitude%22%3A59.9127%2C%22longitude%22%3A10.7461%7D%2C%22to%22%3A%7B%22latitude%22%3A59.9139%2C%22longitude%22%3A10.7522%7D%7D)**

---

## `StopPlaceName`

**Kildefil:** [`tavla/src/graphql/queries/stopPlaceName.graphql`](../tavla/src/graphql/queries/stopPlaceName.graphql)

**Beskrivelse:** Henter kun navn og ID for et stoppested. Brukes til å vise stoppestedsnavn i UI-et.

**Fragmenter:** ingen

**Eksempelvariabler:**
```json
{
  "id": "NSR:StopPlace:59872"
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20StopPlaceName%28%24id%3A%20String%21%29%20%7B%0A%20%20%20%20stopPlace%28id%3A%20%24id%29%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%7D&operationName=StopPlaceName&variables=%7B%22id%22%3A%22NSR%3AStopPlace%3A59872%22%7D)**

---

## `QuayEstimatedCalls`

**Kildefil:** [`tavla/src/graphql/queries/quayEstimatedCalls.graphql`](../tavla/src/graphql/queries/quayEstimatedCalls.graphql)

**Beskrivelse:** Henter alle estimerte avganger for en perrong i løpet av én uke. Brukes til å bygge linje-/destinasjonsfiltre.

**Fragmenter:** ingen

**Eksempelvariabler:**
```json
{
  "quayId": "NSR:Quay:107371",
  "numberOfDepartures": 200
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20QuayEstimatedCalls%28%24quayId%3A%20String%21%2C%20%24numberOfDepartures%3A%20Int%20%3D%20200%29%20%7B%0A%20%20%20%20quay%28id%3A%20%24quayId%29%20%7B%0A%20%20%20%20%20%20%20%20estimatedCalls%28%0A%20%20%20%20%20%20%20%20%20%20%20%20numberOfDepartures%3A%20%24numberOfDepartures%0A%20%20%20%20%20%20%20%20%20%20%20%20numberOfDeparturesPerLineAndDestinationDisplay%3A%201%0A%20%20%20%20%20%20%20%20%20%20%20%20timeRange%3A%20604800%0A%20%20%20%20%20%20%20%20%20%20%20%20includeCancelledTrips%3A%20true%0A%20%20%20%20%20%20%20%20%29%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20destinationDisplay%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20frontText%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20serviceJourney%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20line%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D&operationName=QuayEstimatedCalls&variables=%7B%22quayId%22%3A%22NSR%3AQuay%3A107371%22%2C%22numberOfDepartures%22%3A200%7D)**

---

## `StopPlacesHaveDepartures`

**Kildefil:** [`tavla/src/graphql/queries/stopPlacesDepartures.graphql`](../tavla/src/graphql/queries/stopPlacesDepartures.graphql)

**Beskrivelse:** Sjekker om en liste med stoppesteder har avganger (transportmodi). Brukes til å filtrere tomme stopplasser i søk.

**Fragmenter:** ingen

**Eksempelvariabler:**
```json
{
  "ids": [
    "NSR:StopPlace:59872",
    "NSR:StopPlace:6013"
  ]
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20StopPlacesHaveDepartures%28%24ids%3A%20%5BString%5D%29%20%7B%0A%20%20%20%20stopPlaces%28ids%3A%20%24ids%29%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20quays%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20lines%20%7B%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20%20transportSubmode%0A%20%20%20%20%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%20%20%20%20%7D%0A%20%20%20%20%7D%0A%7D&operationName=StopPlacesHaveDepartures&variables=%7B%22ids%22%3A%5B%22NSR%3AStopPlace%3A59872%22%2C%22NSR%3AStopPlace%3A6013%22%5D%7D)**

---

## `QuayName`

**Kildefil:** [`tavla/src/graphql/queries/quayName.graphql`](../tavla/src/graphql/queries/quayName.graphql)

**Beskrivelse:** Henter navn, beskrivelse og offentlig kode for én perrong. Brukes til visning i UI-et.

**Fragmenter:** ingen

**Eksempelvariabler:**
```json
{
  "id": "NSR:Quay:107371"
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20QuayName%28%24id%3A%20String%21%29%20%7B%0A%20%20%20%20quay%28id%3A%20%24id%29%20%7B%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20description%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%7D%0A%7D&operationName=QuayName&variables=%7B%22id%22%3A%22NSR%3AQuay%3A107371%22%7D)**

---

## `stopPlaceCoordinates`

**Kildefil:** [`tavla/src/graphql/queries/stopPlaceCoordinate.graphql`](../tavla/src/graphql/queries/stopPlaceCoordinate.graphql)

**Beskrivelse:** Henter geografiske koordinater for et stoppested. Brukes til kartvisning.

**Fragmenter:** ingen

**Eksempelvariabler:**
```json
{
  "id": "NSR:StopPlace:59872"
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20stopPlaceCoordinates%28%24id%3A%20String%21%29%20%7B%0A%20%20%20%20stopPlace%28id%3A%20%24id%29%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20longitude%0A%20%20%20%20%20%20%20%20latitude%0A%20%20%20%20%7D%0A%7D&operationName=stopPlaceCoordinates&variables=%7B%22id%22%3A%22NSR%3AStopPlace%3A59872%22%7D)**

---

## `quayEdit`

**Kildefil:** [`tavla/src/graphql/queries/quayEdit.graphql`](../tavla/src/graphql/queries/quayEdit.graphql)

**Beskrivelse:** Henter perrong med tilhørende linjer for bruk i redigeringspanelet.

**Fragmenter:** `lines`

**Eksempelvariabler:**
```json
{
  "placeId": "NSR:Quay:107371"
}
```

**[Åpne i GraphQL Explorer](https://api.entur.io/graphql-explorer/journey-planner-v3?query=query%20quayEdit%28%24placeId%3A%20String%21%29%20%7B%0A%20%20%20%20quay%28id%3A%20%24placeId%29%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20...lines%0A%20%20%20%20%7D%0A%7D%0A%0Afragment%20lines%20on%20Quay%20%7B%0A%20%20%20%20lines%20%7B%0A%20%20%20%20%20%20%20%20id%0A%20%20%20%20%20%20%20%20publicCode%0A%20%20%20%20%20%20%20%20name%0A%20%20%20%20%20%20%20%20transportMode%0A%20%20%20%20%20%20%20%20transportSubmode%0A%20%20%20%20%7D%0A%7D&operationName=quayEdit&variables=%7B%22placeId%22%3A%22NSR%3AQuay%3A107371%22%7D)**

---

## Fragmentoversikt

| Fragment | Type | Avhenger av | Brukes i |
|----------|------|-------------|----------|
| `situation` | `PtSituationElement` | — | `getQuay`, `StopPlace` |
| `lines` | `Quay` | — | `quaysSearch`, `getQuay`, `stopPlaceEdit`, `quayEdit` |
| `departure` | `EstimatedCall` | `situation` | `getQuay`, `StopPlace` |

## Fragmentfiler

- [`tavla/src/graphql/fragments/situation.graphql`](../tavla/src/graphql/fragments/situation.graphql)
- [`tavla/src/graphql/fragments/lines.graphql`](../tavla/src/graphql/fragments/lines.graphql)
- [`tavla/src/graphql/fragments/departure.graphql`](../tavla/src/graphql/fragments/departure.graphql)
