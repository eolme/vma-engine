export declare type Clazz<T> = new (...args: any[]) => T;

const instances = new Map<string, object>();
const SingletonProvider = {
  getInstance<T extends object>(clazz: Clazz<T>, ...params: ConstructorParameters<typeof clazz>): T {
    if (instances.has(clazz.name)) {
      return instances.get(clazz.name) as T;
    }

    const instance = new clazz(...params);
    instances.set(clazz.name, instance);
    return instance;
  },
  destroyInstance<T extends object>(clazz: Clazz<T>) {
    if (instances.has(clazz.name)) {
      instances.delete(clazz.name);
    }
  }
};

export {
  SingletonProvider,
  SingletonProvider as default
};
