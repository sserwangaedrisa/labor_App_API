import type { ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
  className?: string;
}

const Table = ({ headers, children, className = "" }: TableProps) => {
  return (
    <table className={`min-w-full border-collapse ${className}`}>
      <thead className="bg-gray-100">
        <tr>
          {headers.map((header, idx) => (
            <th key={idx} className="border px-4 py-2 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default Table;
