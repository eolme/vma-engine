import { isSafari } from './platform';
import bridge from './bridge';
import worker from './worker';
import { load } from 'worker-timers-broker/build/es2019/module';
import { createLoadWorkerTimers } from 'worker-timers/build/es2019/factories/load-worker-timers';

export declare type Timer = typeof setTimeout | typeof setInterval;
export declare type AnyTimer = (handler: Function, timeout?: number) => ReturnType<Timer>;
export declare type AnyClearTimer = (handle: ReturnType<Timer>) => void;

export declare interface Timers {
  setTimeout: AnyTimer,
  clearTimeout: AnyClearTimer,
  setInterval: AnyTimer
  clearInterval: AnyClearTimer
}

const timers: Timers = {
  setTimeout: null,
  clearTimeout: null,
  setInterval: null,
  clearInterval: null
};

// Web Worker doesn't work well in Android WebView
const isAndroidWebView = bridge.isWebView() && !isSafari;
if (!isAndroidWebView) {
  const safeTimer = (by: AnyTimer, fallback: AnyTimer): AnyTimer => {
    return (handler, time = 0) => {
      try {
        return by(handler, time);
      } catch {
        return fallback(handler, time);
      }
    };
  };

  const safeClear = (by: AnyClearTimer, fallback: AnyClearTimer): AnyClearTimer => {
    return (handle) => {
      try {
        return by(handle);
      } catch {
        return fallback(handle);
      }
    };
  };

  const loadWorkerTimers = createLoadWorkerTimers(load, worker);

  const workerSetTimeout: AnyTimer = (func, delay) => loadWorkerTimers().setTimeout(func, delay);
  const workerClearTimeout: AnyClearTimer = (timerId) => loadWorkerTimers().clearTimeout(timerId);

  timers.setTimeout = safeTimer(workerSetTimeout, window.setTimeout);
  timers.clearTimeout = safeClear(workerClearTimeout, window.clearTimeout);

  const workerSetInterval: AnyTimer = (func, delay) => loadWorkerTimers().setInterval(func, delay);
  const workerClearInterval: AnyClearTimer = (timerId) => loadWorkerTimers().clearInterval(timerId);

  timers.setInterval = safeTimer(workerSetInterval, window.setInterval);
  timers.clearInterval = safeClear(workerClearInterval, window.clearInterval);
} else {
  timers.setTimeout = window.setTimeout.bind(window);
  timers.clearTimeout = window.clearTimeout.bind(window);

  timers.setInterval = window.setInterval.bind(window);
  timers.clearInterval = window.clearInterval.bind(window);
}

// rewrite original
Object.assign(window, timers);

export {
  timers,
  timers as default
};
