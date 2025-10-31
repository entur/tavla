import { nanoid } from "nanoid";
import { TableCell } from "../TableCell";
import { TableColumn } from "../TableColumn";
import { FormattedTime } from "./components/FormattedTime";
import { useNonNullContext } from "../../../../../Shared/hooks/useNonNullContext";
import { DeparturesContext } from "../../contexts";
import {
  formatDateString,
  getRelativeTimeString,
} from "../../../../../Shared/utils/time";

const TWO_MINUTES = 120;

function ExpectedTime() {
  const departures = useNonNullContext(DeparturesContext);

  const time = departures.map((departure) => ({
    aimedDepartureTime: departure.aimedDepartureTime,
    expectedDepartureTime: departure.expectedDepartureTime,
    cancelled: departure.cancellation,
    key: nanoid(),
  }));

  return (
    <TableColumn title="Forventet" className="text-right">
      {time.map((t) => (
        <TableCell key={t.key}>
          <Time
            expectedDepartureTime={t.expectedDepartureTime}
            aimedDepartureTime={t.aimedDepartureTime}
            cancelled={t.cancelled}
          />
        </TableCell>
      ))}
    </TableColumn>
  );
}

function Time({
  expectedDepartureTime,
  aimedDepartureTime,
  cancelled,
}: {
  expectedDepartureTime: string;
  aimedDepartureTime: string;
  cancelled: boolean;
}) {
  if (cancelled)
    return (
      <>
        <div className="text-right text-em-lg/em-lg font-semibold text-estimated-time">
          Innstilt
        </div>
        <div className="lineThrough text-right text-em-sm/em-sm">
          {formatDateString(aimedDepartureTime)}
        </div>
      </>
    );

  const timeDeviationInSeconds = Math.abs(
    (Date.parse(aimedDepartureTime) - Date.parse(expectedDepartureTime)) / 1000
  );

  if (timeDeviationInSeconds > TWO_MINUTES) {
    return (
      <>
        <div className="text-right text-em-xl leading-em-base text-estimated-time">
          {getRelativeTimeString(expectedDepartureTime)}
        </div>
        <div className="lineThrough text-right text-em-sm/em-xs">
          {formatDateString(aimedDepartureTime)}
        </div>
      </>
    );
  }

  return <FormattedTime time={expectedDepartureTime} />;
}

export { ExpectedTime };
