type EventMap = HTMLElementEventMap & WindowEventMap

type EventNames<T extends EventTarget> = T extends Window
  ? keyof WindowEventMap
  : T extends HTMLElement
  ? keyof HTMLElementEventMap
  : never

export const addListener = <T extends EventTarget, U extends EventNames<T>>(
  node: T,
  type: U,
  listener: (ev: EventMap[U]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  const typedListener = (ev: Event) => listener(ev as EventMap[U])

  node.addEventListener(type, typedListener, options)

  return () => node.removeEventListener(type, typedListener, options)
}

export const isTouchDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  (navigator as any).msMaxTouchPoints > 0
