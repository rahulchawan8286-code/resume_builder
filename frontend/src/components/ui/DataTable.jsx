import { cn } from '../../lib/utils';

export function DataTable({ columns, data, className }) {
  return (
    <div className={cn("w-full overflow-auto rounded-md border border-gray-200 dark:border-gray-800", className)}>
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-50 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
          <tr>
            {columns.map((col, i) => (
              <th key={i} className="px-4 py-3 font-medium border-b border-gray-200 dark:border-gray-800">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-800 bg-white dark:bg-gray-950">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-gray-500">
                No results found.
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors">
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-3 text-gray-900 dark:text-gray-100">
                    {col.cell ? col.cell(row) : row[col.accessorKey]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}