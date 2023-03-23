import { useEffect, useState } from "react";
import { tableData, TileTable } from "../TileTable";
import stopPlaceQuery from "@/graphql/stopPlaceQuery.graphql";
import styles from "./styles.css";

function Tile({ id }: { id: string }) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    getStopPlaceData(id).then(setData);

    const interval = setInterval(async () => {
      const data = await getStopPlaceData(id);
      setData(data);
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [id]);

  if (!data) {
    return null;
  }

  return (
    <div className="tile">
      <h3>{data.name}</h3>
      <div className="overflow-hidden">
        <TileTable
          options={{
            destination: "short",
            departure: "absolute",
            line: "outlined",
          }}
          columnOrder={["line", "destination", "departure"]}
          tableData={data.estimatedCalls.map((call) => {
            return {
              lineNumber: call.serviceJourney.line.publicCode,
              departure: call.expectedDepartureTime,
              destination: call.destinationDisplay.frontText,
              transportMode: call.serviceJourney.transportMode,
              vendor: call.serviceJourney.line.authority.name,
              presentationColor: call.serviceJourney.line.presentation.colour,
            } as tableData;
          })}
        />
      </div>
    </div>
  );
}

async function getStopPlaceData(id: string) {
  const query = {
    query: stopPlaceQuery.loc.source.body,
    variables: { stopPlaceId: id },
  };
  return await fetch(
    "https://api.staging.entur.io/journey-planner/v3/graphql",
    {
      headers: {
        "Content-Type": "application/json",
        "ET-Client-Name": "tavla-test",
      },
      body: JSON.stringify(query),
      method: "POST",
      mode: "cors",
    }
  )
    .then((res) => {
      return res.json();
    })
    .then((jsonRes) => jsonRes.data.stopPlace);
}

export { Tile };
