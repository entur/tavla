import { TDeparture } from "@/types/stopPlace";
import React from "react";

const DepartureContext = React.createContext<TDeparture | undefined>(undefined);

export { DepartureContext };
