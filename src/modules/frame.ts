import raf from 'raf';

const nextFrame = raf as typeof requestAnimationFrame;
const cancelFrame = raf.cancel as typeof cancelAnimationFrame;

export {
  nextFrame,
  cancelFrame
};
