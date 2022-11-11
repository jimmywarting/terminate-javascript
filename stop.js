const iframe = document.createElement('iframe')
iframe.srcdoc = ''
iframe.hidden = true
document.body.append(iframe)
const iframeWindow = (/** @type {window} */ (iframe.contentWindow))
const { getEventListeners } = globalThis
const { 
  Object: { entries, assign, getOwnPropertyDescriptors, keys },
  Array: { from, isArray },
  Function: { prototype: { call, apply } },
} = iframeWindow
const noop = () => {}

/******************************************************************************/
/*                         Remove all event listeners                         */
/******************************************************************************/

const removeEventListeners = elm => {
  const events = getEventListeners(elm)

  for (const [name, registrations] of entries(events)) {
    for (const reg of registrations) {
      elm.removeEventListener(name, reg.listener, reg.useCapture)
    }
  }

  for (const key in elm) {
    if (key.startsWith('on') && typeof elm[key] === 'function') {
      elm[key] = null
    }
  }
}

const removeAllDOMEventListeners = () => {
  const allElements = from(document.querySelectorAll('*'))
  allElements.push(document, window)
  allElements.forEach(removeEventListeners)
}

/******************************************************************************/
/*                              Clear all timers                              */
/******************************************************************************/

/** Remove all timeouts */
const clearAllTimeouts = () => {
  let i = 0

  i = setTimeout(noop, 0)
  while (i--) clearTimeout(i)

  i = setInterval(noop, 0)
  while (i--) clearInterval(i)

  i = requestIdleCallback(noop)
  while (i--) cancelIdleCallback(i)

  i = requestAnimationFrame(noop)
  while (i--) cancelAnimationFrame(i)
}

/******************************************************************************/
/*                           Disable functions calls                          */
/******************************************************************************/

const AsyncFunction = (async () => {}).constructor
const GeneratorFunction = (function* () {}).constructor

const disableFunctionCalls = () => {
  Function.prototype.call = 
  Function.prototype.apply = noop
}

const restoreFunctionCalls = () => {
  Function.prototype.call = call
  Function.prototype.apply = apply
}

/******************************************************************************/
/*                                 Web Worker                                 */
/******************************************************************************/

const unregisterServiceWorker = async () => {
  if (navigator.serviceWorker) {
    const registrations = await navigator.serviceWorker.getRegistrations()
    for (const registration of registrations) {
      removeEventListeners(registration)
      registration.unregister()
    }
  }
}

/******************************************************************************/
/*                                Restorations                                */
/******************************************************************************/

const seen = new WeakSet()

/**
 * This will recursively restore all properties of an object to their original
 * values. This is useful for restoring the global object to its original state.
 * it will remove all polyfills if they were added.
 * 
 * Any global variables that were added will be removed recursively.
 * 
 * Element, Object, Array, globalThis are just examples of objects that will be
 * restored.
 */

/*

function restore (original, native) {
  if (seen.has(original)) return
  seen.add(original)

  // We use getOwnPropertyDescriptors to avoid calling getters and setters.
  for (const [key, desc] of entries(getOwnPropertyDescriptors(original))) {
    // TODO
  }
}

restore(globalThis, iframeWindow)

*/

/******************************************************************************/
/*                                    INIT                                    */
/******************************************************************************/

removeAllDOMEventListeners()
clearAllTimeouts()
unregisterServiceWorker()
disableFunctionCalls()

// This is to remove all dom observer
const root = document.documentElement
const clone = root.cloneNode(true)
root.replaceWith(clone)

// TODO: Find custom properties on globalThis and remove them recursively
// depending on their type you can clean them up differently.
