const vendor = String(window.navigator?.vendor);
const ua = String(window.navigator?.userAgent);

export const isSafari = (vendor.includes('Apple') || 'webkit' in window) &&
  !ua.includes('CriOS') && !ua.includes('FxiOS');
