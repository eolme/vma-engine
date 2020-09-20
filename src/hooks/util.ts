import { useMemo } from '../hooks/base';

import bridge from '../modules/bridge';
import bus from '../modules/bus';
import singleton, { Clazz } from '../modules/singleton';

const useBridge = () => {
  return bridge;
};

const useBus = () => {
  return bus;
};

const useSingleton = <T extends object>(clazz: Clazz<T>) => {
  return useMemo(() => {
    const get = () => singleton.getInstance(clazz);
    const destroy = () => singleton.destroyInstance(clazz);

    return {
      get,
      destroy
    };
  }, [clazz]);
};

export {
  useBridge,
  useBus,
  useSingleton
};
