import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, decode, F, Rec, S } from '../delta';
import { cards, Format, grid } from '../grid';
import { ProgressArc } from './progress_arc';
import { getTheme } from '../theme';

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    body: {
      position: 'relative',
      width: grid.unitInnerWidth, height: grid.unitInnerWidth,
    },
    value_overlay: {
      position: 'absolute',
      left: 0, top: 0,
      width: grid.unitInnerWidth, height: grid.unitInnerWidth,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    value: {
      ...theme.font.s24,
      ...theme.font.w3,
    },
    aux_value: {
      ...theme.font.s12,
      color: theme.colors.text7,
    },
  })

interface Opts {
  title: S
  value: S
  aux_value: S
  progress: F
  plot_color: S
  data: S | Rec
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
        <div className={css.body}>
          <ProgressArc size={grid.unitInnerWidth} thickness={2} color={s.plot_color} value={s.progress} />
          <div className={css.value_overlay}>
            <div className={css.value}>
              <Format data={data} format={s.value} />
            </div>
            <div className={css.aux_value}>
              <Format data={data} format={s.aux_value} />
            </div>
          </div>
        </div>
      </div>)
  }
}

cards.register('card5', View)

