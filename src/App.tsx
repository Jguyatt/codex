import { useMemo, useState } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { FolderPicker } from './components/FolderPicker';
import { ScanProgress } from './components/ScanProgress';
import { PreviewTable } from './components/PreviewTable';
import { PaywallModal } from './components/PaywallModal';
import { LicenseManager } from './components/LicenseManager';
import type { ScanResponse } from './lib/fs';
import { applyMockChanges } from './lib/fs';
import { logEvent } from './lib/supabase';
import logo from './assets/logo.svg';

function App() {
  const [scan, setScan] = useState<ScanResponse | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [applySummary, setApplySummary] = useState<string>('');

  const rows = scan?.files ?? [];
  const selectedCount = useMemo(() => rows.filter((row) => row.include).length, [rows]);

  const toggleRow = (id: string) => {
    if (!scan) return;
    setScan({
      ...scan,
      files: scan.files.map((row) => (row.id === id ? { ...row, include: !row.include } : row))
    });
  };

  const handleApply = async () => {
    if (!scan) return;
    if (selectedCount > 50) {
      setPaywallOpen(true);
      return;
    }
    const summary = await applyMockChanges(scan.files);
    setApplySummary(
      `Moved ${summary.moved} files, skipped ${summary.skipped}. Undo log: ${summary.logPath}`
    );
    logEvent('apply_changes', { moved: summary.moved, skipped: summary.skipped });
  };

  const handleCheckout = () => {
    setPaywallOpen(false);
    alert('Mock checkout flow. Provide Paddle/LemonSqueezy keys to activate.');
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text">
      <header className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Clarifile logo" className="h-10 w-10" />
          <div>
            <h1 className="font-header text-2xl text-brand-secondary">Clarifile</h1>
            <p className="text-sm text-brand-text/80">Declutter with confidence.</p>
          </div>
        </div>
        <button
          className="px-4 py-2 rounded-brand border border-brand-primary text-brand-primary text-sm"
          onClick={async () => {
            if (typeof window === 'undefined' || !(window as any).__TAURI__) {
              setApplySummary('Undo requires the Clarifile desktop runtime.');
              return;
            }
            try {
              const summary = await invoke<{ restored: number; log_path?: string }>('undo_last_run');
              setApplySummary(
                `Restored ${summary.restored} moves from ${summary.log_path ?? 'latest log'}`
              );
            } catch (error) {
              console.error(error);
            }
          }}
        >
          Undo last run
        </button>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <FolderPicker onScanComplete={(result) => setScan(result)} onScanning={setIsScanning} />
          <ScanProgress running={isScanning} telemetry={scan?.telemetry} />
        </div>
        <PreviewTable rows={rows} onToggle={toggleRow} />
        <div className="flex items-center justify-between bg-white border border-slate-200 rounded-brand px-4 py-3">
          <div>
            <p className="text-brand-secondary font-medium">Selected files: {selectedCount}</p>
            <p className="text-xs text-brand-text/70">Runs up to 50 files are free.</p>
          </div>
          <button
            onClick={handleApply}
            className="px-4 py-2 rounded-brand bg-brand-accent text-white font-semibold"
            disabled={!scan || selectedCount === 0}
          >
            Apply changes
          </button>
        </div>
        {applySummary && (
          <p className="text-xs text-brand-text/70 font-mono">{applySummary}</p>
        )}
        <LicenseManager />
      </main>
      <PaywallModal
        open={paywallOpen}
        onClose={() => setPaywallOpen(false)}
        onCheckout={handleCheckout}
        fileCount={selectedCount}
      />
    </div>
  );
}

export default App;
