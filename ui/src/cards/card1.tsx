import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, Rec, decode } from '../delta';
import { cards, Format } from '../grid';
import { getTheme } from '../theme';

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    }
  })

interface Opts {
  title: string
  value: string
  data: Rec
}

type State = Partial<Opts>

const defaults: State = {
  title: 'Untitled',
}

class View extends React.Component<Card<State>, State> {
  onChanged = () => this.setState({ ...this.props.data })
  constructor(props: Card<State>) {
    super(props)
    this.state = { ...props.data }
    props.changed.on(this.onChanged)
  }
  render() {
    const
      s = theme.merge(defaults, this.state),
      data = decode(s.data)
    return (
      <div className={css.card}>
        <div className={css.title}>
          <Format data={data} format={s.title} />
        </div>
        <div className={css.value}>
          <Format data={data} format={s.value} />
        </div>
      </div>)
  }
}

cards.register('card1', View)
