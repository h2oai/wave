import { Card } from "h2o-wave"

export const patchCardComp = (card: Card, onDropComp: any, component: string): void => {
  setTimeout(() => {
    const c = document?.querySelector<HTMLDivElement>(`div[data-test="${card.name}"]`)
    if (c) {
      c.style.position = 'relative'
      c.style.minHeight = '100px'
      const labelEl = document.createElement('span')
      labelEl.dataset.cardLabel = ''
      labelEl.style.position = 'absolute'
      labelEl.style.top = '15%'
      labelEl.style.left = '45%'
      labelEl.style.zIndex = '1'
      labelEl.innerText = card.name ?? ''
      labelEl.style.transition = 'all .2s'
      labelEl.style.backgroundColor = 'white'
      labelEl.style.padding = '4px 8px'
      labelEl.style.borderRadius = '4px'
      labelEl.style.border = '2px solid #66c7e8'

      c.onmouseenter = () => {
        const labels = document?.querySelectorAll<HTMLDivElement>(`[data-card-label]`)
        labels.forEach(l => l.style.opacity = '0')
        labelEl.style.opacity = '100'
      }
      
      c.onmouseleave = () => {
        labelEl.style.opacity = '0'
      }
      
      c.appendChild(labelEl)
      if (component === 'form_card') c.ondrop = onDropComp
    }
  }, 0)
}