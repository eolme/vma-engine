let test: any = false;
try {
  const opts = Object.defineProperty({}, 'passive', {
    get() {
      test = { passive: true };
      return true;
    }
  });
  window.addEventListener('passive', null, opts);
  window.removeEventListener('passive', null, opts);
} catch { /* ignore */ }

export const PARAM_PASSIVE = test;
export const PARAM_ACTIVE = test && { passive: false } as any;

export const forcePrevent = (e = window.event) => {
  if (!e) {
    return;
  }

  if (e.cancelable) {
    if (e.preventDefault && !e.defaultPrevented) {
      e.preventDefault();
    } else {
      e.returnValue = false;
    }
  }

  if (e.stopImmediatePropagation) {
    e.stopImmediatePropagation();
  }

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  return false;
};
