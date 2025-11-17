declare module 'react/jsx-runtime' {
  const Fragment: unique symbol;
  export { Fragment };
  export function jsx(type: any, props: any, key?: string): any;
  export function jsxs(type: any, props: any, key?: string): any;
}
