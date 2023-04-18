export function gql(base: TemplateStringsArray, ...fragments: string[]) {
  return [...fragments, ...base].join("");
}

type endpointNames = "journey-planner" | "mobility" | "vehicles";

// tmp until env is in place
const endpoints: Record<endpointNames, string> = {
  ["journey-planner"]:
    "https://api.staging.entur.io/journey-planner/v3/graphql",
  ["mobility"]: "",
  ["vehicles"]: "",
};

export function createQuery<T, V>(
  query: string,
  endpoint: endpointNames = "journey-planner"
): (variables: V) => Promise<T> {
  return (variables: V) =>
    fetch(endpoints[endpoint], {
      headers: {
        "Content-Type": "application/json",
        "ET-Client-Name": "tavla-test",
      },
      body: JSON.stringify({ query, variables }),
      method: "POST",
    })
      .then((res) => {
        return res.json();
      })
      .then((jsonRes) => jsonRes.data as T);
}
