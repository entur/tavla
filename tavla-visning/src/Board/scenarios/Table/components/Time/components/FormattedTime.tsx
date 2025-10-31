import {
  getDate,
  getRelativeTimeString,
  isDateStringToday,
} from "../../../../../../Shared/utils/time";

function FormattedTime({ time }: { time: string }) {
  return (
    <>
      <div className="text-nowrap text-right text-em-xl leading-em-base">
        {getRelativeTimeString(time)}
      </div>
      {!isDateStringToday(time) && (
        <div className="text-right text-em-sm/em-sm">{getDate(time)}</div>
      )}
    </>
  );
}

export { FormattedTime };
