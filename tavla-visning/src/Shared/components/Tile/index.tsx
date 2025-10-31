import React from "react";
import clsx from "clsx";

function Tile({
  className,
  children,
  ...rest
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={clsx(
        "h-full w-full overflow-hidden rounded-lg bg-secondary px-[1em] pt-[0.25em]  text-primary",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}

export { Tile };
