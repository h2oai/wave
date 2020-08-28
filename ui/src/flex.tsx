import React from 'react';
import { cards, Repeat } from './layout';
import { bond, Card, Dict, Rec, S, Data } from './qd';

/**
 * EXPERIMENTAL. DO NOT USE.
 * Create a card containing other cards laid out using a one-dimensional model with flexible alignemnt and wrapping capabilities.
 **/
interface State {
  /** The child card type. */
  item_view: S
  /** The child card properties. */
  item_props: Rec
  /** Data for this card. */
  data: Data
  /** Layout direction. */
  direction?: 'horizontal' | 'vertical'
  /** Layout strategy for main axis. */
  justify?: 'start' | 'end' | 'center' | 'between' | 'around'
  /** Layout strategy for cross axis. */
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  /** Wrapping strategy. */
  wrap?: 'start' | 'end' | 'center' | 'between' | 'around' | 'stretch'
}

const
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

export const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        // FIXME theme.merge()
        return (
          <div style={toFlexStyle(state)} data-test='flex'>
            <Repeat view={state.item_view} props={state.item_props} data={state.data} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('flex', View)
