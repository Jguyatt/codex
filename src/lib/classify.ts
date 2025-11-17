import type { FilePreviewRow } from './fs';

const docKeywords = ['invoice', 'statement', 'assignment'];
const imageKeywords = ['img', 'screenshot', 'photo'];
const videoKeywords = ['mov', 'mp4', 'clip'];

export const classifyFile = (path: string): FilePreviewRow['kind'] => {
  const lower = path.toLowerCase();
  if (docKeywords.some((k) => lower.includes(k))) return 'doc';
  if (imageKeywords.some((k) => lower.includes(k))) return 'image';
  if (videoKeywords.some((k) => lower.includes(k))) return 'video';
  if (lower.endsWith('.pdf')) return 'pdf';
  if (lower.endsWith('.zip')) return 'zip';
  return 'misc';
};
