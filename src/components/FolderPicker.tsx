import { useState } from 'react';
import { mockScan, type ScanResponse } from '../lib/fs';
import { logEvent } from '../lib/supabase';

interface Props {
  onScanComplete: (scan: ScanResponse) => void;
  onScanning: (loading: boolean) => void;
}

const commonFolders = ['Desktop', 'Downloads', 'Documents'];

export function FolderPicker({ onScanComplete, onScanning }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleFolder = (folder: string) => {
    setSelected((prev) =>
      prev.includes(folder) ? prev.filter((item) => item !== folder) : [...prev, folder]
    );
  };

  const handleScan = async () => {
    onScanning(true);
    const result = await mockScan();
    onScanComplete(result);
    onScanning(false);
    logEvent('scan_performed', { fileCount: result.files.length });
  };

  return (
    <section className="brand-card p-4 flex flex-col gap-4">
      <header>
        <h2 className="text-lg font-semibold text-brand-secondary">Select folders</h2>
        <p className="text-sm text-brand-text/80">Clarifile recursively scans these folders.</p>
      </header>
      <div className="flex gap-2 flex-wrap">
        {commonFolders.map((folder) => (
          <button
            key={folder}
            onClick={() => toggleFolder(folder)}
            className={`px-3 py-1 rounded-brand border text-sm transition ${
              selected.includes(folder)
                ? 'bg-brand-primary text-white border-brand-primary'
                : 'bg-white text-brand-text border-slate-200'
            }`}
          >
            {folder}
          </button>
        ))}
      </div>
      <button
        onClick={handleScan}
        className="self-start px-4 py-2 rounded-brand bg-brand-primary text-white font-medium"
      >
        Scan selected folders
      </button>
    </section>
  );
}
