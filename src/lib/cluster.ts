import type { FilePreviewRow } from './fs';

export interface FolderNode {
  name: string;
  path: string;
  children: FolderNode[];
  files: FilePreviewRow[];
}

export const buildFolderTree = (files: FilePreviewRow[]): FolderNode => {
  const root: FolderNode = {
    name: 'Clarifile',
    path: '',
    children: [],
    files: []
  };

  const ensureNode = (parts: string[]): FolderNode => {
    let current = root;
    let builtPath = '';
    parts.forEach((part) => {
      builtPath = builtPath ? `${builtPath}/${part}` : part;
      let child = current.children.find((c) => c.name === part);
      if (!child) {
        child = { name: part, path: builtPath, children: [], files: [] };
        current.children.push(child);
      }
      current = child;
    });
    return current;
  };

  files.forEach((file) => {
    const parts = file.proposedPath.split('/');
    const fileName = parts.pop();
    const targetNode = ensureNode(parts);
    targetNode.files.push({ ...file, proposedPath: `${targetNode.path}/${fileName}` });
  });

  return root;
};
