import WidgetsJSON from '../../../tools/gui/mappings.json'

export interface Widget {
  displayName: string
  name: string
  parameters: Record<string, any>
  id?: string
}

export const LAYOUT = [
  {
    id: 'zone_row',
    displayName: 'Zone Row',
    name: 'zone',
    parameters: {
      name: '',
      direction: 'row',
      zones: [],
    }
  },
  {
    id: 'zone_column',
    displayName: 'Zone Column',
    name: 'zone',
    parameters: {
      name: '',
      direction: 'column',
      zones: [],
    },
  },
]

export const CARDS = WidgetsJSON.filter(w => w.displayName.match(/card/i))

export const WIDGETS: Widget[] = [
  ...LAYOUT,
  ...CARDS, 
]
