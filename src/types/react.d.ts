declare namespace React {
  type ReactNode = any;
  interface ReactElement<P = any> {
    type: any;
    props: P;
    key: string | number | null;
  }
  interface FunctionComponent<P = {}> {
    (props: P & { children?: ReactNode }): ReactElement | null;
  }
  type FC<P = {}> = FunctionComponent<P>;
  function useState<S>(initialState: S | (() => S)): [S, (value: S | ((prev: S) => S)) => void];
  function useMemo<T>(factory: () => T, deps: readonly unknown[]): T;
  function useEffect(effect: () => void | (() => void), deps?: readonly unknown[]): void;
  function useRef<T>(initialValue: T): { current: T };
  const StrictMode: FunctionComponent<{ children?: ReactNode }>;
  const Fragment: unique symbol;
}

declare module 'react' {
  export = React;
}

declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
