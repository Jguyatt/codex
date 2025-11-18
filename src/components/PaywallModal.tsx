interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  fileCount: number;
}

export function PaywallModal({ open, onClose, onCheckout, fileCount }: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
      <div className="brand-card max-w-md w-full p-6">
        <header className="mb-4">
          <h3 className="text-2xl font-semibold text-brand-secondary">Unlock Clarifile Pro</h3>
          <p className="text-sm text-brand-text/80">
            You are applying changes for {fileCount} files. Runs over 50 files require a license.
          </p>
        </header>
        <ul className="space-y-2 text-sm text-brand-text">
          <li>✔️ Unlimited apply actions</li>
          <li>✔️ Priority AI labeling</li>
          <li>✔️ Automatic backups & undo history</li>
        </ul>
        <div className="mt-6 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-slate-200 rounded-brand text-brand-secondary"
          >
            Not now
          </button>
          <button
            onClick={onCheckout}
            className="flex-1 px-4 py-2 rounded-brand bg-brand-primary text-white font-semibold"
          >
            Continue (${fileCount > 50 ? 'Pro' : 'Free'})
          </button>
        </div>
      </div>
    </div>
  );
}
