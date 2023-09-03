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

// Mostly taken from https://github.com/ai/nanoevents
export type Callback<T> = (arg: T) => void
export const createPubSub = <T>() => ({
  emit<K extends keyof T>(event: K, data: T[K]) {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;(this.events[event] || []).forEach((cb) => cb(data))
  },
  events: {} as { [K in keyof T]?: Callback<T[K]>[] },
  on<K extends keyof T>(event: K, cb: Callback<T[K]>) {
    this.events[event]?.push(cb) || (this.events[event] = [cb])
    return () => {
      this.events[event] = this.events[event]?.filter((i) => cb !== i)
    }
  },
})
