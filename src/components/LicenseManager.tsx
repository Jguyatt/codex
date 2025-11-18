import { useState } from 'react';
import { validateLicense } from '../lib/supabase';
import { hashMachine } from '../lib/utils';

export function LicenseManager() {
  const [licenseKey, setLicenseKey] = useState('');
  const [status, setStatus] = useState<string>('No license yet');

  const handleValidate = async () => {
    const machineHash = await hashMachine();
    const result = await validateLicense(licenseKey, machineHash);
    setStatus(result.valid ? 'License active' : `Invalid license (${result.reason ?? 'unknown'})`);
  };

  return (
    <section className="brand-card p-4 flex flex-col gap-3">
      <header>
        <h2 className="text-lg font-semibold text-brand-secondary">License</h2>
        <p className="text-sm text-brand-text/70">Enter a key to unlock unlimited runs.</p>
      </header>
      <div className="flex gap-2">
        <input
          value={licenseKey}
          onChange={(e) => setLicenseKey(e.target.value)}
          placeholder="CLARIFILE-XXXX"
          className="flex-1 rounded-brand border border-slate-200 px-3 py-2"
        />
        <button onClick={handleValidate} className="px-4 py-2 rounded-brand bg-brand-primary text-white">
          Validate
        </button>
      </div>
      <p className="text-xs text-brand-text/80">{status}</p>
    </section>
  );
}
