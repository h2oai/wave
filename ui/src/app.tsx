import React from 'react';
import { stylesheet } from 'typestyle';
import { GridLayout } from './layout';
import { bond, box, connect, Page, S, SockEvent, SockEventType, SockMessageType } from './telesync';
import { getTheme, pc } from './theme';
import { Spinner, SpinnerSize } from '@fluentui/react';

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
    },
    centerFullHeight: {
      height: pc(100),
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: theme.colors.page,
      color: theme.colors.text,
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
            if (e.type === SockMessageType.Err) contentB({ error: e.message })
            break
        }
      },
      init = () => {
        connect('/ws', onSocket)
      },
      render = () => {
        const { page, error } = contentB()
        // TODO prettier error section
        if (error) return <div className={css.centerFullHeight}>{error}</div>
        if (!page) return <Spinner className={css.centerFullHeight} size={SpinnerSize.large} label='Loading ...' />

        return (
          <div className={css.app}>
            <GridLayout key={page.key} page={page} />
          </div>
        )
      }
    return { init, render, contentB }
  })

export default App
