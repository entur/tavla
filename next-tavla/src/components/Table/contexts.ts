import { Departure } from "@/types/stopPlace";
import React from "react";

const DepartureContext = React.createContext<Departure | undefined>(undefined);

export { DepartureContext };
