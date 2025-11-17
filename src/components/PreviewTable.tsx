import { useMemo } from 'react';
import type { FilePreviewRow } from '../lib/fs';

interface Props {
  rows: FilePreviewRow[];
  onToggle: (id: string) => void;
}

export function PreviewTable({ rows, onToggle }: Props) {
  const counts = useMemo(() => {
    return rows.reduce(
      (acc, row) => {
        acc[row.category] = (acc[row.category] ?? 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    );
  }, [rows]);

  return (
    <section className="brand-card p-0 overflow-hidden">
      <header className="sticky top-0 bg-brand-bg border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-brand-secondary">Preview & plan</h2>
          <p className="text-sm text-brand-text/80">Review each proposed move before applying.</p>
        </div>
        <div className="flex gap-2 text-xs text-brand-text/70">
          {Object.entries(counts).map(([category, count]) => (
            <span key={category} className="px-2 py-1 bg-brand-bg border border-slate-200 rounded-brand">
              {category}: {count}
            </span>
          ))}
        </div>
      </header>
      <div className="overflow-auto max-h-[420px]">
        <table className="min-w-full text-sm">
          <thead className="bg-brand-bg text-left text-brand-text/70">
            <tr>
              <th className="px-4 py-2">Include</th>
              <th className="px-4 py-2">Original Path</th>
              <th className="px-4 py-2">Proposed Path</th>
              <th className="px-4 py-2">Type</th>
              <th className="px-4 py-2">Category</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-t border-slate-100 hover:bg-brand-bg/60">
                <td className="px-4 py-2">
                  <input
                    type="checkbox"
                    checked={row.include}
                    onChange={() => onToggle(row.id)}
                    className="h-4 w-4 accent-brand-accent"
                  />
                </td>
                <td className="px-4 py-2 font-mono text-xs">{row.originalPath}</td>
                <td className="px-4 py-2 font-mono text-xs text-brand-primary">{row.proposedPath}</td>
                <td className="px-4 py-2 capitalize">{row.kind}</td>
                <td className="px-4 py-2">{row.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
