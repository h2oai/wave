import React from 'react';
import { Card, Data, Rec, S } from '../delta';
import { cards, Repeat } from '../grid';

interface Opts {
  title: S
  item_view: S
  item_props: S | Rec
  data: S | Data
}

type State = Partial<Opts>

const defaults: State = {
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
      <div>
        <Repeat view={s.item_view} props={s.item_props} data={s.data} />
      </div>
    )
  }
}

cards.register('repeat', View)
