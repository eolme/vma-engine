const nextFrame = window.requestAnimationFrame.bind(window);
const cancelFrame = window.cancelAnimationFrame.bind(window);

export {
  nextFrame,
  cancelFrame
};
