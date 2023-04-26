# Contributing to Tavla

Here you will find instructions on how to setup Tavla locally and tips on how to create your own custom dashboards.

## Installation and Setup

First of all: Make sure you have Node.js v12 or above installed. Check with `node -v`.

Fork the repo: https://github.com/entur/tavla/fork

Run the following commands to install dependencies:

```
git clone git@github.com:[YOUR USERNAME]/tavla.git
cd tavla
npm install
cd functions
npm install
cd ..
```

### Set a client name

You need to set a client name that identifies your application. You decide yourself what it should be, but it should consist of
the name of your company or organization and the name of the application.

```diff
# .env.prod
-CLIENT_NAME=entur-tavla
+CLIENT_NAME=awesomecompany-tavla
```

```diff
# .env.staging
-CLIENT_NAME=entur-tavla-staging
+CLIENT_NAME=awesomecompany-tavla-staging
```

### Develop

Run the development server with

```
npm start
```

Your browser should automatically open the app on http://localhost:9090

You can test production builds with

```
npm run serve         # Uses the .env.prod config file
npm run serve:staging # Uses the .env.staging config file
```

### Develop with local firebase emulators

If you have already configured the firebase CLI you can skip the first two steps.

1. Install Firebase CLI

```
npm i -g firebase-tools

```

2. Sign in to use the CLI

```
firebase login
```

3. Fire up the emulators with

```
firebase emulators:start
```

Your terminal should now tell you where you can find the interface for your emulated firebase instances. Usually it's at [localhost:4000](loclahost:4000).

4.  From the root directory, fire up the web app using your emulators with

```
npm run local
```

Your web app should now be available at [localhost:9090](localhost:9090) showing a banner at the bottom indicating that you are running in emulator mode.

## Code Quality

This project uses TypeScript, so make sure all files you add are .ts files and that TypeScript compiles with:

```
npm test
```

We use ESLint to ensure code quality. Please make sure ESLint is happy with the command:

```
npm run lint
```

## Graphql

This project uses [Graphql Codegen](https://the-guild.dev/graphql/codegen) to generate schema, types and hooks from the endpoints and .graphql-files.
To generate/update/overwrite run:

```shell
npm run graphql-codegen
```

To get the most out of these files you should use a plugin or extension in your editor that helps you write correct graphql. For IntelliJ we recommend using [this plugin](https://plugins.jetbrains.com/plugin/8097-graphql).

### .graphql-files

.graphql-files should be named after which endpoint they point to. For example a query against journey planner should be named:

```
[name].journey-planner.graphql
```

This is a requirement for having graphql-codegen and `.graphqlconfig` pick up file.

## Using your own Firebase Project

We are using Firebase for hosting tavla.entur.no (Firebase Hosting) and we are using Firebase Authentication as our authentication platform. Therefore, if you are thinking of hosting your own fork of Tavla, we would recommend you to do the same.

PS! Make sure you are following the licenses and terms for Tavla: https://github.com/entur/tavla#licenses-and-terms

### Create a project

First of all you need a Firebase _project_. Go to https://console.firebase.google.com to set up a new project.

When the project is set up, add a new Web app to your project from the Project Overview. You don't need to "Add Firebase SDK" – that's already done in this repo.

### Download config

We need to reference the Firebase config through an environment variable called `FIREBASE_CONFIG`.

Press the cogwheel next to "Project Settings" in the left menu and go to "Project settings". Scroll down and find the Config under "Firebase SDK snippet". Copy the config object (the part after `const firebaseConfig = `). You need to stringify this and put it in your `.env.staging` file. To stringify it, you can open the browser console and run `JSON.stringify(<CONFIG OBJECT>)`. Set the resulting string as the value for `FIREBASE_CONFIG` in the .env.prod file:

```diff
# .env.prod
JOURNEYPLANNER_HOST_V2=https://api.entur.io/journey-planner/v2
JOURNEYPLANNER_HOST_V3=https://api.entur.io/journey-planner/v3
GEOCODER_HOST=https://api.entur.io/geocoder/v1
-FIREBASE_CONFIG='{"apiKey":"AIz...
+FIREBASE_CONFIG='{"apiKey":"<YOUR_CONFIG ... >
```

### Configure .firebaserc

Now let's update the `.firebaserc` file. Replace the project name with your own. You might not have a staging project, so just remove that:

```diff
{
  "projects": {
+    "prod": "myawesome-project"
-    "prod": "entur-tavla",
-    "staging": "tavla-stage"
  }
}
```

### Enable Authentication

In the Firebase Console (console.firebase.google.com), go to "Authentication" and "Sign-in method". Enable "Anonymous".

### Enable Firestore

In the Firebase Console (console.firebase.google.com), go to "Database" and setup Firestore. You need to select a region.
We went for "eur3", the multi-region option in Europe.

The Firestore Rules are defined in the `firestore.rules` file in this repository.

### Deploy

We're close! Make sure you have the Firebase CLI installed globally:

```
npm install --global firebase-tools
```

And log in to the account that owns your project:

```
firebase login
```

When that's done, run

```
npm run deploy:prod
```

This will build the app and deploy it to the `prod` project that is defined in `.firebaserc`.

Enjoy!

## Dashboards

A _dashboard_ is an entire frontend or view/theme/skin that displays departure data in some fashion. Currently we have three such dashboards: "Kompakt" (Compact), "Kronologisk" (Chrono) and "Tidslinja" (Timeline).

Properties of a dashboard:

-   Should be completely _separated_ and _independent_ from other dashboards.
-   Might not suit all use cases, locations or transports

Although the dashboards are independent and might look totally different, they have some things in common:

-   They use some React hooks that handle data fetching (`useStopPlacesWithDepartures`, `useBikeRentalStations`)
-   They use the DashboardWrapper component to add the default header and menu

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

```tsx
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
    history: any
}

export default Sooon
```

The DashboardWrapper component will give us the default header and menu. `useStopPlaceDepartures` is a [React hook](https://reactjs.org/docs/hooks-intro.html) that will give us relevant stop place departures data based on the configurations in the admin panel every 30 seconds.

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

In `src/containers/Admin/VisningTab/index.tsx`, add an entry for your dashboard in the picker:

```diff
<div className="visning-wrapper">
    <RadioCard
        title="Kompakt (standard)"
        description="Alle avgangene til en linje vises på en samlet rad. Ikke egnet for linjer som varierer spor/plattform."
        cardValue="Compact"
        selected={radioValue === 'Compact'}
        preview={CompactSVG}
        callback={(val): void => updateChoice(val)}
    />
    <RadioCard
        title="Kronologisk"
        description="Avgangene vises i en kronologisk rekkefølge. Egner seg godt for linjer som varierer spor/plattform."
        cardValue="Chrono"
        selected={radioValue === 'Chrono'}
        preview={ChronoSVG}
        callback={(val): void => updateChoice(val)}
    />
+   <RadioCard
+       title="Sooon"
+       description="A dashboard that says "sooooon"."
+       cardValue="Sooon"
+       selected={radioValue === 'Sooon'}
+       preview={SooonSVG}
+       callback={(val): void => updateChoice(val)}
+   />
    <RadioCard
        title="Tidslinje"
        description="Avgangene vises i en visualisert fremstilling. Viser ikke bysykkel, spor/plattform eller avvik."
        cardValue="Timeline"
        selected={radioValue === 'Timeline'}
        preview={TimelineSVG}
        callback={(val): void => updateChoice(val)}
    />
</div>
```

That's it! You should now be able to select your dashboard in the admin tab, and you should see the "Hello World" heading.

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
