import { Card } from "h2o-wave"
import { Layout, Zone } from "../meta"

export const generateCode = (layouts: Layout[] = [], cards: Card[] = [], logic = '') => {
  return `page['meta'] = ui.meta_card(box='', layouts=[\n  ${mapLayoutsToCode(layouts)}\n])\n\n${mapCardsToCode(cards)}\n\n${logic}`
}

const mapLayoutsToCode = (layouts: Layout[]): string => {
  return `${layouts.map(l => `ui.layout(\n    breakpoint='${l.breakpoint}',\n    zones=[${mapZonesToCode(l.zones)}]\n  )`)}`
}

const mapZonesToCode = (zones: Zone[]) => zones.map(z => `ui.zone(${mapObjectToParameters(z)})`).join(', ')

const mapCardsToCode = (cards: Card[]): string => {
  return cards.map(c => {
    const state = {...c.state }
    delete state.view
    return `page['${c.id}'] = ui.${c.state.view}_card(${mapObjectToParameters(state)})`
  }).join('\n')
}

const mapObjectToParameters = (obj: Record<string, any>): string => {
  return Object.entries(obj).map(([key, value]) => `${key}=${mapParameterValue(value)}`).join(', ')
}

const mapParameterValue = (value: any): string => {
  if (Array.isArray(value)) return '[]'
  if (typeof value === 'boolean') return String(value)[0].toUpperCase() + String(value).substring(1)
  return `'${value}'`
}