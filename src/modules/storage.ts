import bridge from './bridge';

const shouldUseVKStorage =
  bridge.supports('VKWebAppStorageGet') &&
  bridge.supports('VKWebAppStorageSet');

type PersistStorage = {
  get: () => Promise<object>;
  set: (value: object) => Promise<boolean>;
};

const VKStorage: PersistStorage = {
  get() {
    return bridge.send('VKWebAppStorageGet', {
      keys: ['persist']
    }).then((storage) => {
      const { value } = storage.keys[0];
      return value ? JSON.parse(value) : {};
    }).catch(() => {
      return {};
    });
  },
  set(value) {
    return bridge.send('VKWebAppStorageSet', {
      key: 'persist',
      value: JSON.stringify(value)
    }).then((state) => {
      return state.result;
    }).catch(() => {
      return false;
    });
  }
};

const localStorage: PersistStorage = {
  get() {
    const value = window.localStorage.getItem('persist');
    return Promise.resolve(value ? JSON.parse(value) : {});
  },
  set(value) {
    window.localStorage.setItem('persist', JSON.stringify(value));
    return Promise.resolve(true);
  }
};

const storage = shouldUseVKStorage ? VKStorage : localStorage;

export {
  storage,
  storage as default
};
