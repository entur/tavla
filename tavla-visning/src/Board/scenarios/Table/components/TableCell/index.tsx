function TableCell({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex h-[2.75em] w-full items-center border-t border-solid border-t-secondary ${
        className || ""
      }`}
    >
      <div className="mx-em-0.25 w-full">{children}</div>
    </div>
  );
}

export { TableCell };
