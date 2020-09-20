import React, {
  useState,
  useRef,
  useEffect,
  useLayoutEffect,
  useMemo as useDeepMemo,
  useContext,
  useCallback as useDeepCallback
} from 'react';

import {
  useCreation as useMemo,
  usePersistFn as useImmutableCallback,
  useMount,
  useUnmount,
  useUpdate as useForceUpdate,
  useUpdateEffect as useUpdate,
  useSetState as useHeavyState,
  useDebounceFn
} from 'ahooks';

import type { DebounceOptions } from 'ahooks/lib/useDebounce/debounceOptions';

const useCallback: typeof useDeepCallback = (callback, deps) => {
  /* eslint-disable react-hooks/exhaustive-deps */
  return useMemo(() => {
    return callback;
  }, deps as any);
};

const useElementRef = <T>(): [T, React.LegacyRef<T>] => {
  const [element, setElement] = useState<T>(null);
  const ref = useCallback((node) => {
    if (node !== null) {
      setElement(node);
    }
  }, []);
  return [element, ref];
};

const useCompute = <T>(factory: () => T): T => {
  return factory();
};

const useLazyState = <T>(initialValue?: T, options: DebounceOptions = { wait: 230 }): [T, (value: T) => void] => {
  const [state, setState] = useState<T>(initialValue);
  const setLazyState = useDebounceFn(setState, options);
  return [state, setLazyState.run];
};

export {
  useRef,
  useState,
  useLazyState,
  useHeavyState,
  useMemo,
  useDeepMemo,
  useCompute,
  useCallback,
  useDeepCallback,
  useImmutableCallback,
  useElementRef,
  useMount,
  useUnmount,
  useUpdate,
  useLayoutEffect,
  useEffect,
  useForceUpdate,
  useContext
};
