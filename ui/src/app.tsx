import { Spinner, SpinnerSize } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { FlexLayout } from './flex_layout'
import { GridLayout } from './grid_layout'
import { bond, box, Card, connect, Page, qd, S, SockEvent, SockEventType, SockMessageType } from './qd'
import { View as SideNav } from './side_nav'
import { clas, getTheme, mobileBreakpoint, pc, topNavHeight, sideNavWidth } from './theme'
import { State as TopNavState, View as TopNav } from './top_nav'

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
      top: topNavHeight,
      $nest: {
        ...mobileBreakpoint({ marginBottom: 75 })
      }
    },
    appWithSideNav: {
      marginLeft: sideNavWidth,
      transition: 'margin-left .5s'
    },
    centerFullHeight: {
      height: pc(100),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.page,
      color: theme.colors.text,
    },
    mobileTopSideNav: {
      display: 'none',
      $nest: {
        ...mobileBreakpoint({
          display: 'block'
        })
      }
    }
  }),
  MobileTopSideNav = (state: TopNavState) => {
    return (
      <div className={css.mobileTopSideNav}>
        <TopNav {...{ name: 'mobile-side-nav', state, changed: box(false) }} />
      </div>
    )
  }


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

        const
          topNav = page.list().find(c => c.state.view === 'top_nav') as Card<any>,
          sideNav = page.list().find(c => c.state.view === 'side_nav') as Card<any>,
          topNavClass = topNav ? css.appWithTopNav : '',
          sideNavClass = sideNav ? css.appWithSideNav : ''

        return (
          <>
            {topNav && <TopNav {...topNav} />}
            {sideNav && <SideNav {...sideNav} />}
            {sideNav && !topNav && <MobileTopSideNav {...{ ...sideNav!.state.header, items: [] } as TopNavState} />}
            <main className={clas(css.app, topNavClass, sideNavClass)}>{getLayout(page)}</main>
          </>
        )
      },
      dispose = () => window.removeEventListener('hashchange', onHashChanged)

    return { init, render, dispose, contentB, layoutMode: qd.layoutB }
  })

export default App
