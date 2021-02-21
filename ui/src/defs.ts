import { CardAttrT, CardDef } from './editing'
import { B, S } from './qd'

const
  attr = (t: CardAttrT, name: S, value: S = '', optional: B = false) => ({ t, name, value, optional })

export const
  cardDefs: CardDef[] = [
    {
      view: 'markdown',
      icon: 'InsertTextBox',
      attrs: [
        attr(CardAttrT.String, 'box', '1 1 2 2'),
        attr(CardAttrT.String, 'title', 'Card title'),
        attr(CardAttrT.Text, 'content', 'Some *content*.'),
      ],
    },
    {
      view: 'chat',
      icon: 'OfficeChat',
      attrs: [
        attr(CardAttrT.String, 'box', '1 1 2 2'),
        attr(CardAttrT.String, 'title', 'Card title'),
        attr(CardAttrT.Text, 'content', 'Some *content*.'),
      ],
    },
    {
      view: 'canvas',
      icon: 'EditCreate',
      attrs: [
        attr(CardAttrT.String, 'box', '1 1 2 2'),
        attr(CardAttrT.String, 'title', 'Card title'),
        attr(CardAttrT.Text, 'content', 'Some *content*.'),
      ],
    },
  ]