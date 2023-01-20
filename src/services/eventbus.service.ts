export const EventBus = {
  $on(eventType: string, callback: (data?: any) => void) {
    document.addEventListener(eventType, (ev: any) => callback(ev.detail))
  },

  $emit(eventType: string, data?: any) {
    const event = new CustomEvent(eventType, { detail: data })
    document.dispatchEvent(event)
  },

  $off(eventType: string, callback: (data?: any) => void) {
    document.removeEventListener(eventType, callback)
  },
}
