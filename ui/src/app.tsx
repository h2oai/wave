import React from 'react';
import { stylesheet } from 'typestyle';
import { GridLayout } from './grid';
import { bond, box, connect, Page, SockEvent, SockEventType, SockMessageType, S } from './telesync';
import { getTheme } from './theme';

const
  theme = getTheme(),
  css = stylesheet({
    app: {
      position: 'absolute',
      left: 0, top: 0, right: 0, bottom: 0,
      backgroundColor: theme.colors.page,
      color: theme.colors.text,
      display: 'flex',
      justifyContent: 'center'
    }
  })


const
  App = bond(() => {
    const
      contentB = box<{ page?: Page, error?: S }>({}),
      onSocket = (e: SockEvent) => {
        switch (e.t) {
          case SockEventType.Data:
            contentB({ page: e.page })
            break
          case SockEventType.Message:
            if (e.type === SockMessageType.Err) {
              contentB({ error: e.message })
            } else {
              console.log(e)
            }
            break
        }
      },
      init = () => {
        connect('/ws', onSocket)
      },
      render = () => {
        const { page, error } = contentB()
        // TODO prettier error section
        if (error) return <div>{error}</div>
        // TODO prettier loading section
        if (!page) return <div>Loading...</div>

        return (
          <div className={css.app}>
            <GridLayout key={page.key} page={page} />
          </div>
        )
      }
    return { init, render, contentB }
  })

export default App
