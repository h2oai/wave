import React from 'react';
import { stylesheet } from 'typestyle';
import { Card, Data, Rec, S } from '../delta';
import { cards, Repeat } from '../grid';
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

interface Opts {
  title: S
  item_view: S
  item_props: S | Rec
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
    const
      s = { ...defaults, ...this.state } as Opts
    return (
      <div className={css.card}>
        <div className={css.title}>{s.title}</div>
        <div className={css.body}>
          <Repeat view={s.item_view} props={s.item_props} data={s.data} />
        </div>
      </div>
    )
  }
}

cards.register('list', View)
