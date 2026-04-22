import { cn } from "@/lib/utils/cn";

export function Table({
  headers,
  rows,
  className,
}: {
  headers: string[];
  rows: Array<Array<React.ReactNode>>;
  className?: string;
}) {
  return (
    <div className={cn("overflow-hidden rounded-[var(--radius-panel)] border border-[var(--color-panel-border)] bg-white shadow-none", className)}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-[var(--color-panel-border)]">
          <thead className="bg-[var(--color-panel-muted)]">
            <tr>
              {headers.map((header) => (
                <th key={header} className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-600)]">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--color-panel-border)]">
            {rows.map((cells, rowIndex) => (
              <tr key={rowIndex} className="align-top">
                {cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="px-4 py-3.5 text-sm text-[var(--color-ink-800)]">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
