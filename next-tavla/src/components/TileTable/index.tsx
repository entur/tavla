import styles from "./styles.css";

export type tableData = {
  lineNumber: string;
  destination: string;
  vendor: string;
  departure: string;
  transportMode: any;
  presentationColor?: string;
};

type options = {
  destination?: "short" | "long";
  departure?: "relative" | "absolute";
  line?: "simple" | "outlined";
};

type columnType = keyof options;

function TileTable({
  options,
  columnOrder,
  tableData,
}: {
  options: options;
  columnOrder: columnType[];
  tableData: tableData[];
}) {
  const uniqOptions: columnType[] = columnOrder;
  const gridTemplate = gridTemplateColumns(uniqOptions);
  return (
    <table className="tile-table">
      <thead>
        <tr style={{ gridTemplateColumns: gridTemplate }} className="tile-row">
          {uniqOptions.map((option: columnType) => (
            <th className="header-text" key={option}>
              {getColumnTitle(option)}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {tableData.map((entry: tableData) => (
          <tr
            key={entry.lineNumber + entry.destination + entry.departure}
            style={{ gridTemplateColumns: gridTemplate }}
            className="tile-row"
          >
            {uniqOptions.map((option) => TableEntry(option, entry))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function TableEntry(optionsOrder: columnType, data: tableData) {
  switch (optionsOrder) {
    case "departure":
      return <td key={optionsOrder}>{data.departure}</td>;
    case "line":
      return (
        <td key={optionsOrder}>
          <div>{data.transportMode}</div>
        </td>
      );
    case "destination":
      return <td key={optionsOrder}>{data.destination}</td>;
    default:
      return null;
  }
}

function gridTemplateColumns(optionsOrder: columnType[]) {
  return optionsOrder
    .map((option) => {
      switch (option) {
        case "destination":
          return "3fr";
        default:
          return "1fr";
      }
    })
    .join(" ");
}

function getColumnTitle(column: columnType) {
  switch (column) {
    case "departure":
      return "Avgang";
    case "destination":
      return "Destinasjon";
    case "line":
      return "Linje";
  }
}

export { TileTable };
