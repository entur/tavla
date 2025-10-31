import {
  CLIENT_NAME,
  GRAPHQL_ENDPOINTS,
  type TEndpointNames,
} from "../assets/env";
import { addMinutesToDate, formatDateToISO } from "../utils/time";
import { TypedDocumentString } from "./index";

async function fetchWithTimeout(
  url: RequestInfo | URL,
  options: RequestInit | undefined,
  timeout = 15000
) {
  const controller = new AbortController();
  const signal = controller.signal;

  const timeoutScheduler = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, { ...options, signal });
    clearTimeout(timeoutScheduler);
    return response;
  } catch (error) {
    clearTimeout(timeoutScheduler);
    throw error;
  }
}

export async function fetcher<Data, Variables>([
  query,
  variables,
  endpointName,
  offset,
]: [TypedDocumentString<Data, Variables>, Variables, TEndpointNames, number]) {
  const startTime = formatDateToISO(addMinutesToDate(new Date(), offset));
  const mergedVariables = { ...variables, startTime };

  return fetchWithTimeout(GRAPHQL_ENDPOINTS[endpointName], {
    headers: {
      "Content-Type": "application/json",
      "ET-Client-Name": CLIENT_NAME,
    },
    body: JSON.stringify({ query, variables: mergedVariables }),
    method: "POST",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      return res.data as Data;
    });
}

type TFetchQueryOptions = {
  endpoint: TEndpointNames;
  offset?: number;
};

export async function fetchQuery<Data, Variables>(
  query: TypedDocumentString<Data, Variables>,
  variables: Variables,
  options?: Partial<TFetchQueryOptions>
) {
  const mergedOptions: TFetchQueryOptions = {
    endpoint: "journey-planner",
    ...options,
  };
  return fetcher([
    query,
    variables,
    mergedOptions.endpoint,
    mergedOptions.offset ?? 0,
  ]);
}
