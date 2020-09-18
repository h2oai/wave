import React from 'react'
import { stylesheet } from 'typestyle'
import { GridLayout } from './grid_layout'
import { bond, box, connect, Page, S, SockEvent, SockEventType, SockMessageType, qd } from './qd'
import { getTheme, pc, clas, topNavBreakpoint } from './theme'
import { Spinner, SpinnerSize } from '@fluentui/react'
import { FlexLayout } from './flex_layout'
import { TopNav } from './top_nav'

const
  theme = getTheme(),
  css = stylesheet({
    app: {
      position: 'absolute',
      left: 0, top: 0, right: 0, bottom: 0,
      backgroundColor: theme.colors.page,
      color: theme.colors.text,
      display: 'flex',
      justifyContent: 'center',
      overflow: 'auto'
    },
    appWithTopNav: {
      top: 81,
      $nest: {
        ...topNavBreakpoint({ marginBottom: 75 })
      }
    },
    centerFullHeight: {
      height: pc(100),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
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
      onHashChanged = () => {
        const h = window.location.hash
        if (h && h.length > 1) {
          qd.args['#'] = h.substr(1)
        }
        qd.sync()
      },
      init = () => {
        connect('/_s', onSocket)
        window.addEventListener('hashchange', onHashChanged)
      },
      getLayout = (page: Page) => {
        switch (qd.layoutB()) {
          case 'flex': return <FlexLayout page={page} />
          default: return <GridLayout page={page} />
        }
      },
      render = () => {
        const { page, error } = contentB()

        // TODO prettier error section
        if (error) {
          const errorMessage = error === 'not_found'
            ? (<Spinner label='Waiting for content...' size={SpinnerSize.large} />)
            : error
          return <div className={clas(css.centerFullHeight, css.app)}>{errorMessage}</div>
        }
        if (!page) return <Spinner className={css.centerFullHeight} size={SpinnerSize.large} label='Loading ...' />

        const topNav = qd.topNavB()
        return (
          <>
            {topNav && <TopNav {...topNav} />}
            <main className={clas(css.app, topNav ? css.appWithTopNav : '')}>{getLayout(page)}</main>
          </>
        )
      },
      dispose = () => window.removeEventListener('hashchange', onHashChanged)

    return { init, render, dispose, contentB, layoutMode: qd.layoutB, topNav: qd.topNavB }
  })

export default App
