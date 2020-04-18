// https://stackoverflow.com/questions/3007480/determine-if-user-navigated-from-mobile-safari/
const isIosSafari = () =>
  /(iPad|iPhone|iPod)/gi.test(navigator.userAgent) &&
  !/CriOS/.test(navigator.userAgent) &&
  !/FxiOS/.test(navigator.userAgent) &&
  !/OPiOS/.test(navigator.userAgent) &&
  !/mercury/.test(navigator.userAgent)

export default isIosSafari
