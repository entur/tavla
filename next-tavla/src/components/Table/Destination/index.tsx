import { Situation } from "@/components/Situation";
import { useNonNullContext } from "@/hooks/useNonNullContext";
import { TSituation } from "@/types/graphql";
import { DepartureContext } from "../contexts";
import classes from "./styles.module.css";

function Destination() {
  const departure = useNonNullContext(DepartureContext);

  const situations: TSituation[] = departure.situations.length
    ? departure.situations
    : Math.random() * 2 > 1
    ? [
        {
          id: "situation:1231231",
          description: [
            {
              value:
                "veldig forsinket, personalet har forsovet seg veldig forsinket, personalet er dessverre veldig forsinket forsovet seg veldig forsinket,personalet har forsovet seg veldig forsinket, personalet har forsovet seg personalet har forsovet seg veldig forsinket, personalet har forsovet seg",
              language: "no",
            },
          ],
          summary: [{ value: "forsinket", language: "no" }],
        },
      ]
    : [];
  return (
    <td>
      <div className={classes.destination}>
        <div>{departure.destinationDisplay?.frontText}</div>
        {situations.map((situation) => (
          <Situation key={situation.id} situation={situation} />
        ))}
      </div>
    </td>
  );
}
export { Destination };
