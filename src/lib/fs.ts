export interface FilePreviewRow {
  id: string;
  originalPath: string;
  proposedPath: string;
  kind: string;
  category: string;
  include: boolean;
}

export interface ScanTelemetry {
  scannedAt: string;
  durationMs: number;
  fileCount: number;
}

export interface ScanResponse {
  files: FilePreviewRow[];
  telemetry: ScanTelemetry;
}

export const mockScan = async (): Promise<ScanResponse> => {
  const now = new Date();
  const files: FilePreviewRow[] = [
    {
      id: '1',
      originalPath: '/Users/me/Desktop/IMG_1234.png',
      proposedPath: 'Memories/2025/2025-08 Wonderland Trip/Friends – Night Ride.png',
      kind: 'image',
      category: 'Memories',
      include: true
    },
    {
      id: '2',
      originalPath: '/Users/me/Documents/MAT137_assignment.pdf',
      proposedPath: 'School/MAT137/MAT137 – Series Assignment – Oct 2025.pdf',
      kind: 'pdf',
      category: 'School',
      include: true
    },
    {
      id: '3',
      originalPath: '/Users/me/Downloads/Screenshot 2023-02-11.png',
      proposedPath: 'Misc/Review/Screenshot 2023-02-11.png',
      kind: 'image',
      category: 'Misc',
      include: false
    }
  ];

  return {
    files,
    telemetry: {
      scannedAt: now.toISOString(),
      durationMs: 2150,
      fileCount: files.length
    }
  };
};

export const applyMockChanges = async (rows: FilePreviewRow[]) => {
  const included = rows.filter((row) => row.include);
  return {
    moved: included.length,
    skipped: rows.length - included.length,
    logPath: '~/.clarifile/logs/mock-run.json'
  };
};
