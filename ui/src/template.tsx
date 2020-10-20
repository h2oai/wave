import Handlebars from 'handlebars'
import React from 'react'
import { cards, substitute } from './layout'
import { MarkupCard, XMarkup } from './markup'
import { bond, Card, Rec, S, unpack, B } from './qd'

/** Render dynamic content using an HTML template.*/
export interface Template {
  /** The Handlebars template. https://handlebarsjs.com/guide/ */
  content: S
  /** Data for the Handlebars template */
  data?: Rec
  /** An identifying name for this component. */
  name?: S
  /** True if the component should be visible. Defaults to true. */
  visible?: B
}

/** Render dynamic content using an HTML template.*/
interface State {
  /** The title for this card.*/
  title: S
  /** The Handlebars template. https://handlebarsjs.com/guide/ */
  content: S
  /** Data for the Handlebars template. */
  data?: Rec
}

export const
  XTemplate = bond(({ model: m }: { model: Template }) => {
    const
      template = Handlebars.compile(m.content || ''),
      render = () => {
        const data = unpack(m.data)
        return <div data-test={m.name}><XMarkup model={{ content: template(data || {}), visible: m.visible }} /></div>
      }
    return { render }
  }),
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      template = Handlebars.compile(state.content || ''),
      render = () => {
        const data = unpack(state.data)
        return <MarkupCard name={name} title={substitute(state.title, data)} content={template(data || {})} />
      }
    return { render, changed }
  })

cards.register('template', View)
