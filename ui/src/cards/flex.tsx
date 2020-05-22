import React from 'react';
import bond from '../bond';
import { Card, Dict, Rec, S, TupleSet } from '../delta';
import { cards, Repeat } from '../grid';

interface State {
  title: S
  item_view: S
  item_props: Rec
  direction: 'horizontal' | 'vertical'
  justify: 'start' | 'end' | 'center' | 'between' | 'around'
  align: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  wrap: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
  data: TupleSet
}

const
  defaults: Partial<State> = {
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

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        // FIXME theme.merge()
        const s = { ...defaults, ...state } as State
        return (
          <div style={toFlexStyle(s)}>
            <Repeat view={s.item_view} props={s.item_props} data={s.data} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('flex', View)
