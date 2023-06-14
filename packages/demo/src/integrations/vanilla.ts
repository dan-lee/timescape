import { TimescapeManager, type DateType } from 'timescape'

const prepare = (container: HTMLElement) => {
  // this could be rendered as HTML already
  container.innerHTML = `
    <div class='timescape-root'>
      <input class='timescape-input' data-type='days' placeholder='dd' />
      <span class='separator'>/</span>
      <input class='timescape-input' data-type='months' placeholder='mm' />
      <span class='separator'>/</span>
      <input class='timescape-input' data-type='years' placeholder='yyyy' />
      <span class='separator'>&nbsp;</span>
      <input class='timescape-input' data-type='hours' placeholder='hh' />
      <span class='separator'>:</span>
      <input class='timescape-input' data-type='minutes' placeholder='mm' />
      <span class='separator'>:</span>
      <input class='timescape-input' data-type='seconds' placeholder='ss' />
    </div>
  `
}

export const renderTo = (container: HTMLElement) => {
  prepare(container)

  const manager = new TimescapeManager()

  manager.subscribe((date) => {
    console.log('changed date', date)
    document.getElementById('result')!.innerHTML = date
      ? date.toLocaleString('en-UK')
      : ''
  })

  manager.registerRoot(container.querySelector('.timescape-root')!)

  const elements =
    container.querySelectorAll<HTMLInputElement>('.timescape-input')

  for (const element of elements) {
    manager.registerElement(element, element.dataset.type as DateType)
  }

  document.getElementById('now')!.addEventListener('click', () => {
    manager.date = new Date()
  })

  document.getElementById('reset')!.addEventListener('click', () => {
    manager.date = undefined
  })

  return () => {
    manager.remove()
    container.innerHTML = ''
  }
}
