export default function DataTable({ columns, rows, emptyMessage = 'No records found.' }) {
  return (
    <div className="portal-table-shell overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left text-sm">
          <thead className="portal-table-head">
            <tr>
              {columns.map((column) => (
                <th key={column.key} className="portal-table-cell px-4 py-3 font-medium uppercase tracking-[0.18em]">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.length === 0 ? (
              <tr>
                <td className="portal-table-cell px-4 py-6" colSpan={columns.length}>
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={row.id ?? rowIndex} className="portal-table-row">
                  {columns.map((column) => (
                    <td key={column.key} className="portal-table-cell px-4 py-3">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
