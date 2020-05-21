import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, Data, decode, Rec, S, xid, B } from '../delta';
import { cards, CardView, Format } from '../grid';
import { getTheme } from '../theme';
import bond from '../bond';
import { box } from '../dataflow';

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
    },
    table: {
      width: '100%',
    }
  })

interface Opts {
  title: S
  cells: S | Data
  data: S | Data
}

type State = Partial<Opts>

const defaults: State = {
  title: 'Untitled',
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const s = { ...defaults, ...state } as Opts
        let cells = decode<any[]>(state.cells)

        if (!Array.isArray(cells)) cells = [{ title: 'Data' }]

        const
          ths = cells.map((cell, i) => (<th key={i}>{cell.title}</th>)),
          columns = cells.map(({ view, props, value }) => ({ view, props: decode<Rec>(props), value })),
          trs = decode<Rec[]>(s.data).map((data, i) => {
            const tds = columns.map(({ view, props, value }, j) => {
              if (value != null) {
                return <td><Format data={data} format={value} /></td>
              } else {
                const card: Card<any> = {
                  name: xid(),
                  state: { ...props, view, data },
                  changed: box<B>(),
                }
                return <td><CardView key={j} card={card} /></td>
              }
            })
            return (<tr key={i}>{tds}</tr>)
          })

        return (
          <div className={css.card}>
            <div className={css.title}>{s.title}</div>
            <div className={css.body}>
              <table className={css.table}>
                <thead>
                  <tr>{ths}</tr>
                </thead>
                <tbody>
                  {trs}
                </tbody>
              </table>
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('table', View)

