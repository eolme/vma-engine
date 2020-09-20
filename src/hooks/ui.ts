import { useEffect, useRef } from './base';

import swipe from '../modules/swipe';
import vibrate from '../modules/vibrate';
import makeAppSecure from '../modules/safe';
import { lockBodyScroll } from '../modules/dom';

const useSwipe = () => {
  return swipe;
};

const useVibrate = () => {
  return vibrate;
};

const useAppSecure = () => {
  useEffect(() => {
    return makeAppSecure();
  }, []);
};

const useLockScroll = (locked = true) => {
  const element = useRef(document.body);

  useEffect(() => {
    return lockBodyScroll(element.current, locked);
  }, [locked, element]);
};

export {
  useSwipe,
  useVibrate,
  useAppSecure,
  useLockScroll
};
