import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, Data, decode, newEvent, Rec, S, xid } from '../delta';
import { cards, CardView, Format } from '../grid';
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

class View extends React.Component<Card<State>, State> {
  onChanged = () => this.setState({ ...this.props.data })
  constructor(props: Card<State>) {
    super(props)
    this.state = { ...props.data }
    props.changed.on(this.onChanged)
  }
  render() {
    const s = { ...defaults, ...this.state } as Opts
    let cells = decode<any[]>(this.state.cells)

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
              data: { ...props, view, data },
              changed: newEvent(),
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
}

cards.register('table', View)

