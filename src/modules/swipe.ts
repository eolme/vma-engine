import bridge from './bridge';
import { forcePrevent, PARAM_ACTIVE } from './events';

const SWIPE_EVENTS = ['dragstart', 'dragenter', 'gesturestart', 'gesturechange', 'MSGestureStart'];

const swipe = {
  state: false,
  enable() {
    if (this.state) {
      return;
    }
    this.state = true;

    if (bridge.supports('VKWebAppEnableSwipeBack')) {
      bridge.send('VKWebAppEnableSwipeBack');
    }

    SWIPE_EVENTS.forEach((event) => {
      document.removeEventListener(event, forcePrevent, PARAM_ACTIVE);
    });
  },
  disable() {
    if (!this.state) {
      return;
    }
    this.state = false;

    if (bridge.supports('VKWebAppDisableSwipeBack')) {
      bridge.send('VKWebAppDisableSwipeBack');
    }

    SWIPE_EVENTS.forEach((event) => {
      document.addEventListener(event, forcePrevent, PARAM_ACTIVE);
    });
  }
};

export {
  swipe,
  swipe as default
};
