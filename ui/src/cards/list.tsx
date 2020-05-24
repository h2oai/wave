import React from 'react';
import { stylesheet } from 'typestyle';
import { cards, Repeat } from '../grid';
import { bond, Card, Rec, S, TupleSet } from '../telesync';
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
    body: {
      flexGrow: 1,
      overflow: 'auto',
      $nest: {
        '>*': {
          borderBottom: '1px solid ' + theme.colors.text1,
          padding: '5px 0',
        },
      },
    }
  })

interface State {
  title: S
  item_view: S
  item_props: Rec
  data: TupleSet
}

const defaults: Partial<State> = {
  title: 'Untitled',
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const
          s = { ...defaults, ...state } as State
        return (
          <div className={css.card}>
            <div className={css.title}>{s.title}</div>
            <div className={css.body}>
              <Repeat view={s.item_view} props={s.item_props} data={s.data} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('list', View)
