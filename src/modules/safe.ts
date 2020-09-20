import { PARAM_ACTIVE, forcePrevent } from './events';

const AUX_EVENTS = ['auxclick', 'contextmenu'];
const DEV_EVENTS = ['keydown', 'keypress'];
const DEV_KEYS = ['KeyI', 'KeyJ', 'KeyC'];
const DEV_CODES = [73, 74, 67];

const makeAppSecure = () => {
  const preventDevTools = (event: KeyboardEvent) => {
    if (event.defaultPrevented) {
      return;
    }

    const meta = event.shiftKey && (event.ctrlKey || event.metaKey);

    let handled = false;
    if (typeof event.key === 'string') {
      handled = event.key === 'F12' || (meta && DEV_KEYS.includes(event.key));
    } else {
      handled = event.keyCode === 124 || (meta && DEV_CODES.includes(event.keyCode));
    }

    if (handled) {
      return forcePrevent(event);
    }
  };

  AUX_EVENTS.forEach((type) => {
    document.addEventListener(type, forcePrevent, PARAM_ACTIVE);
  });

  DEV_EVENTS.forEach((type) => {
    document.addEventListener(type, preventDevTools, PARAM_ACTIVE);
  });

  return () => {
    AUX_EVENTS.forEach((type) => {
      document.removeEventListener(type, forcePrevent, PARAM_ACTIVE);
    });

    DEV_EVENTS.forEach((type) => {
      document.removeEventListener(type, preventDevTools, PARAM_ACTIVE);
    });
  };
};

export {
  makeAppSecure,
  makeAppSecure as default
};
