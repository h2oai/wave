import React from 'react';
import { Card } from '../delta';
import { cards } from '../grid';

interface State {
  value?: string
}

class NoneCard extends React.Component<Card<State>, State> {
  onChanged = () => this.setState({ ...this.props.data })
  constructor(props: Card<State>) {
    super(props)
    this.state = { ...this.props.data }
    props.changed.on(this.onChanged)
  }
  render() {
    return (
      <div>
        <pre>{JSON.stringify(this.state, null, 2)}</pre>
      </div>
    )
  }
}

cards.register('', NoneCard)