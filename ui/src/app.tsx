import React from 'react';
import { connect, F, Page, S, SockEvent, SockEventType, SockMessageType } from './delta';
import { PageView } from './page';
import { grid } from './grid';
import { stylesheet } from 'typestyle';
import { getTheme } from './theme';

const
  autoscale = false,
  theme = getTheme(),
  css = stylesheet({
    page: {
      position: 'absolute',
      left: 0, top: 0, right: 0, bottom: 0,
      // display: 'flex', justifyContent: 'center',
      backgroundColor: theme.colors.page,
      color: theme.colors.text,
    }
  })
class App extends React.Component<{}, {
  page?: Page
  error?: S
  scale: F
}>{
  onResize = () => this.setState({ scale: grid.rescale() })
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
    this.state = { scale: grid.rescale() }
  }
  componentWillUnmount() {
    if (autoscale) window.removeEventListener('resize', this.onResize)
  }
  async componentDidMount() {
    if (autoscale) window.addEventListener('resize', this.onResize)
    connect('/ws', this.onSocket)
  }
  render() {
    const { page, error, scale } = this.state
    if (error) {
      return <div>{error}</div>
    }
    if (!page) {
      return <div>Loading...</div>
    }

    const scaling = autoscale ? {
      transform: `scale(${scale},${scale})`,
      transformOrigin: `50% top`,
    } : null

    return (
      <div className={css.page}>
        <div style={{
          position: 'absolute',
          width: grid.width,
          ...scaling,
        }}>
          <PageView key={page.key} page={page} />
        </div>
      </div>
    )

  }
}

export default App
