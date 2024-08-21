const fs = require('fs')

const query = fs.readFileSync('./introspect.graphql', 'utf-8')

fetch('https://api.entur.io/journey-planner/v3/graphql', {
    headers: {
        'Content-Type': 'application/json',
        'ET-Client-Name': 'entur-introspection',
    },
    method: 'POST',
    body: `{"query":${JSON.stringify(
        query,
    )},"operationName":"IntrospectionQuery"}`,
})
    .then((res) => res.text())
    .then((schema) => fs.writeFile('./schema.json', schema, console.log))
