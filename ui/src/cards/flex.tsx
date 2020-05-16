import React from 'react';
import { Card, Data, Dict, Rec, S } from '../delta';
import { cards, Repeat } from '../grid';

interface Opts {
  title: S
  item_view: S
  item_props: S | Rec
  direction: 'horizontal' | 'vertical'
  justify: 'start' | 'end' | 'center' | 'between' | 'around'
  align: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  wrap: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
  data: S | Data
}

type State = Partial<Opts>

const
  defaults: State = {
  },
  directions: Dict<S> = {
    horizontal: 'row',
    vertical: 'column',
  },
  justifications: Dict<S> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
  },
  alignments: Dict<S> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    baseline: 'baseline',
    stretch: 'stretch',
  },
  wrappings: Dict<S> = {
    start: 'flex-start',
    end: 'flex-end',
    center: 'center',
    between: 'space-between',
    around: 'space-around',
    stretch: 'stretch',
  },
  toFlexStyle = (state: State): React.CSSProperties => {
    const
      css: React.CSSProperties = { display: 'flex' },
      direction = directions[state.direction || ''],
      justify = justifications[state.justify || ''],
      align = alignments[state.align || ''],
      wrap = wrappings[state.wrap || '']

    if (direction) css.flexDirection = direction as any
    if (justify) css.justifyContent = justify
    if (align) css.alignItems = align
    if (wrap) {
      css.flexWrap = 'wrap'
      css.alignContent = wrap
    }
    return css
  }


class View extends React.Component<Card<State>, State> {
  onChanged = () => this.setState({ ...this.props.data })
  constructor(props: Card<State>) {
    super(props)
    this.state = { ...props.data }
    props.changed.on(this.onChanged)
  }
  render() {
    const s = { ...defaults, ...this.state } as Opts
    return (
      <div style={toFlexStyle(s)}>
        <Repeat view={s.item_view} props={s.item_props} data={s.data} />
      </div>
    )
  }
}

cards.register('flex', View)
