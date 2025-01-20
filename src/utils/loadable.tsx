/* eslint-disable @typescript-eslint/no-explicit-any */
import { lazy, Suspense, ComponentProps } from 'react';

export function loadable(importComponent: () => Promise<any>) {
  const LazyComponent = lazy(importComponent);
  // eslint-disable-next-line react/display-name
  return (props: ComponentProps<any>): JSX.Element => {
    return (
      <Suspense>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
