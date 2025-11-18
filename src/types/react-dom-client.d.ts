declare module 'react-dom/client' {
  import type * as React from 'react';

  interface Root {
    render(children: React.ReactNode): void;
  }

  export function createRoot(container: Element | DocumentFragment): Root;

  const client: {
    createRoot: typeof createRoot;
  };

  export default client;
}
