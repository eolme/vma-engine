export declare type EventType = string | symbol | '*';
export declare type Handler<T = any> = (event: T | null, type: EventType) => void;
export declare type EventHandlerList = Set<Handler>;
export declare type EventHandlerMap = Map<EventType, EventHandlerList>;
export declare type EventOnceHandlerMap = Map<Handler, Handler>;

export declare interface Emitter {
  on<T = any>(type: EventType, handler: Handler<T>): void;
  once<T = any>(type: EventType, handler: Handler<T>): void;
  off<T = any>(type: EventType, handler: Handler<T>): void;
  emit<T = any>(type: EventType, event?: T): void;
  clear(): void
}

const createBus = (): Emitter => {
  const mettEvents: EventHandlerMap = new Map<EventType, EventHandlerList>();
  const onceEvents: EventOnceHandlerMap = new Map<Handler, Handler>();

  const mett: Emitter = {
    on<T = any>(type: EventType, handler: Handler<T>) {
      const set = mettEvents.get(type);
      if (set) {
        set.add(handler);
      } else {
        mettEvents.set(type, new Set([handler]));
      }
    },
    once<T = any>(type: EventType, handler: Handler<T>) {
      const wrapper: Handler<T> = (event: T, type: EventType) => {
        mett.off(type, handler);
        handler(event, type);
      };
      onceEvents.set(handler, wrapper);
      const set = mettEvents.get(type);
      if (set) {
        set.add(wrapper);
      } else {
        mettEvents.set(type, new Set([wrapper]));
      }
    },
    off<T = any>(type: EventType, handler: Handler<T>) {
      const once = onceEvents.get(handler);
      if (once) {
        onceEvents.delete(handler);
        handler = once;
      }
      const set = mettEvents.get(type);
      if (set) {
        set.delete(handler);
      }
    },
    emit<T = any>(type: EventType, event: T = null) {
      const setName = mettEvents.get(type) as EventHandlerList;
      if (setName) {
        setName.forEach((handler) => {
          handler(event, type);
        });
      }
    },
    clear() {
      mettEvents.clear();
      onceEvents.clear();
    }
  };

  return mett;
};

const readonlyBus = createBus() as Readonly<Emitter>;

export {
  createBus,
  readonlyBus as bus,
  readonlyBus as default
};
