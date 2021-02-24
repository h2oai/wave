import { CardAttr, CardDef } from './editing'
import { B, S, U } from './qd'

const
  strAttr = (name: S, value: S, optional: B = false): CardAttr => ({ t: 'textbox', name, value, optional }),
  textAttr = (name: S, value: S, optional: B = false): CardAttr => ({ t: 'textarea', name, value, optional }),
  intAttr = (name: S, value: U, min: U, max: U, step: U, optional: B = false): CardAttr => ({ t: 'spinbox', name, value, min, max, step, optional }),
  recAttr = (name: S, value: any, optional: B = false): CardAttr => ({ t: 'record', name, value, optional })

export const
  cardDefs: CardDef[] = [
    {
      view: 'markdown',
      icon: 'InsertTextBox',
      attrs: [
        strAttr('box', '1 1 2 2'),
        strAttr('title', 'Card title'),
        textAttr('content', 'Some *content*.'),
      ],
    },
    {
      view: 'chat',
      icon: 'OfficeChat',
      attrs: [
        strAttr('box', '1 1 2 2'),
        strAttr('title', 'Card title'),
        textAttr('content', 'Some *content*.'),
      ],
    },
    {
      view: 'canvas',
      icon: 'EditCreate',
      attrs: [
        strAttr('box', '1 1 2 2'),
        strAttr('title', 'Card title'),
        intAttr('width', 400, 0, 1024 * 2, 1),
        intAttr('height', 300, 0, 768 * 2, 1),
        recAttr('data', {}),
      ],
    },
  ]