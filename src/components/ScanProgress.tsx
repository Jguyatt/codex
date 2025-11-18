interface Props {
  running: boolean;
  telemetry?: {
    fileCount: number;
    durationMs: number;
    scannedAt: string;
  };
}

export function ScanProgress({ running, telemetry }: Props) {
  return (
    <section className="brand-card p-4 flex flex-col gap-3">
      <header className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-brand-secondary">Scan status</h2>
          <p className="text-sm text-brand-text/80">
            {running ? 'Scanning in progress…' : 'Idle'}
          </p>
        </div>
        <span className={`text-xs font-medium px-3 py-1 rounded-brand ${running ? 'bg-brand-primary/10 text-brand-primary' : 'bg-brand-accent/10 text-brand-accent'}`}>
          {running ? 'Running' : 'Ready'}
        </span>
      </header>
      <div className="grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-brand-text/70">Files</p>
          <p className="text-brand-secondary text-lg font-semibold">{telemetry?.fileCount ?? '—'}</p>
        </div>
        <div>
          <p className="text-brand-text/70">Duration</p>
          <p className="text-brand-secondary text-lg font-semibold">
            {telemetry ? `${(telemetry.durationMs / 1000).toFixed(2)}s` : '—'}
          </p>
        </div>
        <div>
          <p className="text-brand-text/70">Last run</p>
          <p className="text-brand-secondary text-lg font-semibold">
            {telemetry ? new Date(telemetry.scannedAt).toLocaleTimeString() : '—'}
          </p>
        </div>
      </div>
    </section>
  );
}
