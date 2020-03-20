# Contributing to Tavla

Here you will find instructions on how to setup Tavla locally and tips on how to create your own custom dashboards.

## Installation and Setup

First of all: Make sure you have Node.js v10.13.0 or above installed. Check with `node -v`.

Fork the repo: https://github.com/entur/tavla/fork

Run the following commands to install dependencies:

```
git clone git@github.com:[YOUR USERNAME]/tavla.git
cd tavla
npm install
```

Run the development server with

```
npm start
```

Your browser should automatically open the app on http://localhost:9090

## Code Quality

This project uses TypeScript, so make sure all files you add are .ts files and that TypeScript compiles.

We use ESLint to ensure code quality. Please make sure ESLint is happy with the command:

```
npm run lint
```

## Dashboards

A _dashboard_ is an entire frontend or view/theme/skin that displays departure data in some fashion. Currently we have three such dashboards: "Kompakt" (Compact), "Kronologisk" (Chrono) and "Tidslinja" (Timeline).

Properties of a dashboard:
* Should be completely *separated* and *independent* from other dashboards.
* Might not suit all use cases, locations or transports

Although the dashboards are independent and might look totally different, they have some things in common:
* They use some React hooks that handle data fetching (`useStopPlacesWithDepartures`, `useBikeRentalStations`)
* They use the DashboardWrapper component to add the default header and footer

Adding a new Dashboard is easy. Let's go through it!

### Creating a Dashboard: The Tutorial

We will create a very simple dashboard called "Sooon". It will display the name of the stop place as a heading. Below each stop place we will display the relevant departures. For each departure we will display the route's name, and next to it a variant of the word "Soon". We will add an "o" for each second that remains until it departs. So "37 Helsfyr: Soooon" means that the bus 37 Helsfyr will leave in 2 seconds. Silly? Yes, but this is only a tutorial.

![Sooon GIF](/sooon.gif)

#### Step 1: Adding files

Create a directory called "Sooon" in `src/dashboards`: `src/dashboards/Sooon` and add an empty `index.tsx` file to it. The structure should look like this:

```diff
src/
  dashboards/
    Chrono/
    Compact/
    Timeline/
+   Sooon/
+     index.tsx
```

#### Step 2: Creating a dummy component

Copy the following into `src/dashboards/Sooon/index.tsx`:

```js
import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'

function Sooon({ history }: Props): JSX.Element {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="sooon"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            <h1>Hello World</h1>
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default Sooon
```

The DashboardWrapper component will give us the default header and footer. `useStopPlaceDepartures` is a [React hook](https://reactjs.org/docs/hooks-intro.html) that will give us relevant stop place departures data based on the configurations in the admin panel every 30 seconds.

There is no way to select your new dashboard yet, so let's fix that.

#### Step 3: Making your dashboard available

In `src/containers/App.tsx`, import your new dashboard and add it to the `getDashboardComponent` switch:

```diff
import Compact from '../dashboards/Compact'
import Chrono from '../dashboards/Chrono'
import Timeline from '../dashboards/Timeline'
+import Sooon from '../dashboards/Sooon'

function getDashboardComponent(dashboardKey?: string | void) {
    switch (dashboardKey) {
        case 'Timeline':
            return Timeline
        case 'Chrono':
            return Chrono
+       case 'Sooon':
+           return Sooon
        default:
            return Compact
    }
}
```

In `src/containers/DashboardWrapper/Footer/index.tsx`, add an entry for your dashboard in the picker:

```diff
<form onSubmit={submit}>
    <RadioBox value="" selected={choice === ''} onChange={onChange}>
        <Heading3>Kompakt</Heading3>
        <Paragraph>De tre neste avgangene til en linje vises på samme rad.</Paragraph>
    </RadioBox>
    <RadioBox value="Chrono" selected={choice === 'Chrono'} onChange={onChange}>
        <Heading3>Kronologisk</Heading3>
        <Paragraph>Hver avgang får sin egen rad.</Paragraph>
    </RadioBox>
    <RadioBox value="Timeline" selected={choice === 'Timeline'} onChange={onChange}>
        <Heading3>Tidslinja</Heading3>
        <Paragraph>Avgangene ruller mot høyre mot målet. Ikke egnet for bysykkel.</Paragraph>
    </RadioBox>
+   <RadioBox value="Sooon" selected={choice === 'Sooon'} onChange={onChange}>
+       <Heading3>Sooon</Heading3>
+       <Paragraph>A dashboard that says "sooooon".</Paragraph>
+   </RadioBox>
    <div className="footer-modal__buttons">
        <Button variant="primary" type="submit">Lagre valg</Button>
        <Button variant="secondary" type="button" onClick={(): void => setModalOpen(false)}>Avbryt</Button>
    </div>
</form>
```

That's it! You should now be able to select your dashboard in the menu, And you should see the "Hello World" heading.


#### Step 4: Displaying some data

It's time to put the dashboard to use. We already have the data we need from the `useStopPlaceDepartures` hook, so let's display some of that.

Make the following changes to `src/dashboards/Sooon/index.tsx`:

```diff
import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'

function Sooon({ history }: Props): JSX.Element {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="sooon"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
-           <h1>Hello World</h1>
+           { (stopPlacesWithDepartures || []).map(stopPlace => {
+               return (
+                   <div key={stopPlace.id}>
+                       <h2>{stopPlace.name}</h2>
+                       { (stopPlace.departures || []).map(departure => (
+                           <p key={departure.id}>
+                               { `${departure.route}: ${departure.time}` }
+                           </p>
+                       )) }
+                   </div>
+               )
+           }) }
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default Sooon

```

You should now have a list of departures on your page, and therefore a fully functional dashboard! Data will be refreshed every 30 seconds.

#### Step 5: Adding some "o"

Let's create a function for generating our "Soooooon" word and add it. We can use the `timeUntil` utility and a departure's `expectedDepartureTime` field to get the number of seconds until departure.

```diff
import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'
+import { timeUntil } from '../../utils'
+
+function getSooonLabel(expectedDepartureTime: string): string {
+    const secondsUntilDeparture = timeUntil(expectedDepartureTime)
+    return 'Soo'.padEnd(secondsUntilDeparture, 'o') + 'n'
+}

function Sooon({ history }: Props): JSX.Element {
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
            className="sooon"
            history={history}
            stopPlacesWithDepartures={stopPlacesWithDepartures}
        >
            { (stopPlacesWithDepartures || []).map(stopPlace => {
                return (
                    <div key={stopPlace.id}>
                        <h2>{stopPlace.name}</h2>
                        { (stopPlace.departures || []).map(departure => (
                            <p key={departure.id}>
-                               { `${departure.route}: ${departure.time}` }
+                               { `${departure.route}: ${getSooonLabel(departure.expectedDepartureTime)}` }
                            </p>
                        )) }
                    </div>
                )
            }) }
        </DashboardWrapper>
    )
}

interface Props {
    history: any,
}

export default Sooon
```

Hooooooray! We have long words and a cool dashboard. But since new data is only fetched every 30 seconds, it's quite static. Let's spice it up by forcing re-renders every second with the `useCounter` hook:

```diff
import React from 'react'

import DashboardWrapper from '../../containers/DashboardWrapper'
import { useStopPlacesWithDepartures } from '../../logic'
-import { timeUntil } from '../../utils'
+import { timeUntil, useCounter } from '../../utils'

function getSooonLabel(expectedDepartureTime: string): string {
    const secondsUntilDeparture = timeUntil(expectedDepartureTime)
    return 'Soo'.padEnd(secondsUntilDeparture, 'o') + 'n'
}

function Sooon({ history }: Props): JSX.Element {
+   useCounter()
    const stopPlacesWithDepartures = useStopPlacesWithDepartures()

    return (
        <DashboardWrapper
```

This forces a re-render every second. The "sooon label" will be recalculated, and we have a more lively dashboard.

Congratulations on your new dashboard! :tada:
