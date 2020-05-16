
import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, Rec, decode } from '../delta';
import { cards, Format } from '../grid';
import { getTheme } from '../theme';
import Handlebars from 'handlebars'


const
  theme = getTheme(),
  css = stylesheet({
    titledCard: {

    },
    untitledCard: {
      display: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
  })

interface Opts {
  title: string
  template: string
  data: Rec
}

type State = Partial<Opts>

const defaults: State = {
  title: ''
}

class View extends React.Component<Card<State>, State> {
  template: HandlebarsTemplateDelegate<any> | null = null
  onChanged = () => this.setState({ ...this.props.data })
  constructor(props: Card<State>) {
    super(props)
    this.state = { ...props.data }
    props.changed.on(this.onChanged)
    this.template = Handlebars.compile(this.state.template)
  }
  render() {
    const
      s = theme.merge(defaults, this.state),
      data = decode(s.data),
      html = this.template ? { __html: this.template(data) } : undefined
    return s.title
      ? (
        <div className={css.titledCard}>
          <div className={css.title}><Format data={data} format={s.title} /></div>
          <div dangerouslySetInnerHTML={html}></div>
        </div>
      )
      : (
        <div className={css.untitledCard} dangerouslySetInnerHTML={html} />
      )
  }
}

cards.register('template', View)
