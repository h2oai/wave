import React from 'react';
import { stylesheet } from 'typestyle';
import { GridLayout } from './grid_layout';
import { connect, Page, S, SockEvent, SockEventType, SockMessageType } from './telesync';
import { getTheme } from './theme';

const
  theme = getTheme(),
  css = stylesheet({
    app: {
      position: 'absolute',
      left: 0, top: 0, right: 0, bottom: 0,
      backgroundColor: theme.colors.page,
      color: theme.colors.text,
    }
  })
class App extends React.Component<{}, {
  page?: Page
  error?: S
}>{
  onSocket = (e: SockEvent) => {
    switch (e.t) {
      case SockEventType.Data:
        this.setState({ page: e.page, error: '' })
        break
      case SockEventType.Message:
        if (e.type === SockMessageType.Err) {
          this.setState({ error: e.message })
        } else {
          console.log(e)
        }
        break
    }
  }
  constructor(props: {}) {
    super(props)
    this.state = {}
  }
  async componentDidMount() {
    connect('/ws', this.onSocket)
  }
  render() {
    const { page, error } = this.state
    if (error) {
      return <div>{error}</div>
    }
    if (!page) {
      return <div>Loading...</div>
    }

    return (
      <div className={css.app}>
        <GridLayout key={page.key} page={page} />
      </div>
    )

  }
}

export default App
