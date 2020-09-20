import { isSafari } from './platform';
import { forcePrevent, PARAM_ACTIVE } from './events';

const bodies = new Map<HTMLBodyElement, any>();
let documentListenerAdded = false;

const getClosestBody = (el: HTMLElement): HTMLBodyElement | null => {
  if (!el) {
    return null;
  } else if (el.tagName === 'BODY') {
    return el as HTMLBodyElement;
  } else if (el.tagName === 'IFRAME') {
    const document = (el as HTMLIFrameElement).contentDocument;
    return document ? (document.body as HTMLBodyElement) : null;
  } else if (!el.offsetParent) {
    return null;
  }

  return getClosestBody(el.offsetParent as HTMLElement);
};

const lockBodyScroll = (element?: HTMLElement, locked?: boolean) => {
  const body = getClosestBody(element);
  if (!body) {
    return;
  }

  const bodyInfo = bodies.get(body);

  if (locked) {
    if (!bodyInfo) {
      bodies.set(body, { counter: 1, initialOverflow: body.style.overflow });
      if (isSafari) {
        if (!documentListenerAdded) {
          document.addEventListener('touchmove', forcePrevent, PARAM_ACTIVE);
          documentListenerAdded = true;
        }
      } else {
        body.style.overflow = 'hidden';
      }
    } else {
      bodies.set(body, { counter: bodyInfo.counter + 1, initialOverflow: bodyInfo.initialOverflow });
    }
  } else {
    if (bodyInfo) {
      if (bodyInfo.counter === 1) {
        bodies.delete(body);
        if (isSafari) {
          body.ontouchmove = null;

          if (documentListenerAdded) {
            document.removeEventListener('touchmove', forcePrevent, PARAM_ACTIVE);
            documentListenerAdded = false;
          }
        } else {
          body.style.overflow = bodyInfo.initialOverflow;
        }
      } else {
        bodies.set(body, { counter: bodyInfo.counter - 1, initialOverflow: bodyInfo.initialOverflow });
      }
    }
  }

  return () => {
    const bodyInfo = bodies.get(body);

    if (bodyInfo) {
      if (bodyInfo.counter === 1) {
        bodies.delete(body);

        document.removeEventListener('touchmove', forcePrevent, PARAM_ACTIVE);
        body.style.overflow = bodyInfo.initialOverflow;
      } else {
        bodies.set(body, { counter: bodyInfo.counter - 1, initialOverflow: bodyInfo.initialOverflow });
      }
    }
  };
};

export {
  getClosestBody,
  lockBodyScroll
};
