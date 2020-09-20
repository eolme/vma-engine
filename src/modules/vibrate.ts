import bridge from './bridge';

const vibrate = {
  notification() {
    if (bridge.supports('VKWebAppTapticNotificationOccurred')) {
      bridge.send('VKWebAppTapticNotificationOccurred', {
        type: 'warning'
      });
    } else if ('vibrate' in window.navigator) {
      window.navigator.vibrate(100);
    } else if ('mozVibrate' in window.navigator) {
      ((window.navigator as any).mozVibrate as Navigator['vibrate'])(100);
    }
  },
  selection() {
    if (bridge.supports('VKWebAppTapticSelectionChanged')) {
      bridge.send('VKWebAppTapticSelectionChanged');
    } else if ('vibrate' in window.navigator) {
      window.navigator.vibrate(70);
    } else if ('mozVibrate' in window.navigator) {
      ((window.navigator as any).mozVibrate as Navigator['vibrate'])(70);
    }
  },
  impact() {
    if (bridge.supports('VKWebAppTapticImpactOccurred')) {
      bridge.send('VKWebAppTapticImpactOccurred', {
        style: 'medium'
      });
    } else if ('vibrate' in window.navigator) {
      window.navigator.vibrate(50);
    } else if ('mozVibrate' in window.navigator) {
      ((window.navigator as any).mozVibrate as Navigator['vibrate'])(50);
    }
  }
};

export {
  vibrate,
  vibrate as default
};
