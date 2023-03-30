import { Situation } from "@/components/Situation";
import { useNonNullContext } from "@/hooks/useNonNullContext";
import { TSituation } from "@/types/stopPlace";
import { DepartureContext } from "../contexts";
import classes from "./styles.module.css";

function Destination() {
  const departure = useNonNullContext(DepartureContext);

  const situations: TSituation[] =
    Math.random() * 2 > 1
      ? [
          {
            description: [
              {
                value: "veldig forsinket, personalet har forsovet seg",
                language: "no",
              },
            ],
            summary: [{ value: "forsinket", language: "no" }],
            severity: "slight",
          },
        ]
      : departure.situations;
  return (
    <td>
      <div className={classes.destination}>
        <div>{departure.destinationDisplay.frontText}</div>
        {situations.map((situation) => (
          <Situation key={situation.id} situation={situation} />
        ))}
      </div>
    </td>
  );
}
export { Destination };
