export const addElementListener = <
  T extends EventTarget,
  U extends EventNames<T>,
>(
  node: T,
  type: U,
  listener: (ev: EventMap[U]) => void,
  options?: boolean | AddEventListenerOptions,
) => {
  const typedListener = (ev: Event) => listener(ev as EventMap[U])

  node.addEventListener(type, typedListener, options)

  return () => node.removeEventListener(type, typedListener, options)
}

type EventMap = HTMLElementEventMap & WindowEventMap

type EventNames<T extends EventTarget> = T extends Window
  ? keyof WindowEventMap
  : T extends HTMLElement
    ? keyof HTMLElementEventMap
    : never

export const isTouchDevice = () =>
  'ontouchstart' in window ||
  navigator.maxTouchPoints > 0 ||
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (navigator as any).msMaxTouchPoints > 0

// Mostly taken from https://github.com/ai/nanoevents
export const STOP_EVENT_PROPAGATION = Symbol('STOP_EVENT_PROPAGATION')
export type Callback<T> = (arg: T) => void | typeof STOP_EVENT_PROPAGATION
export const createPubSub = <T>() => ({
  emit<K extends keyof T>(event: K, data: T[K]) {
    // Added STOP_PROPAGATION to allow stepping out of the loop
    // eslint-disable-next-line no-extra-semi
    ;(this.events[event] || []).some(
      (cb) => cb(data) === STOP_EVENT_PROPAGATION,
    )
  },
  events: {} as { [K in keyof T]?: Callback<T[K]>[] },
  on<K extends keyof T>(event: K, cb: Callback<T[K]>) {
    this.events[event]?.push(cb) || (this.events[event] = [cb])
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i)
    }
  },
})
