import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Format, grid } from './grid';
import { bond, Card, decode, F, Rec, S } from './telesync';
import { getTheme } from './theme';
import { ProgressArc } from './parts/progress_arc';

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

interface State {
  title: S
  value: S
  aux_value: S
  progress: F
  plot_color: S
  data: Rec
}

const defaults: Partial<State> = {
  title: 'Untitled',
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = theme.merge(defaults, state),
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
    return { render, changed }
  })

cards.register('card5', View)

