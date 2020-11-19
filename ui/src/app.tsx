import { Spinner, SpinnerSize } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { GridLayout } from './layout'
import { bond, box, connect, Page, qd, S, SockEvent, SockEventType, SockMessageType } from './qd'
import { clas, getTheme, pc } from './theme'

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
    centerFullHeight: {
      height: pc(100),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: theme.colors.page,
      color: theme.colors.text,
    },
    freeOverlay: {
      position: 'fixed',
      left: 0, top: 0, right: 0, bottom: 0,
      opacity: 0,
      zIndex: -1,
    },
    busyOverlay: {
      position: 'fixed',
      left: 0, top: 0, right: 0, bottom: 0,
      opacity: 0.8,
      zIndex: 1,
      transition: 'opacity 1s 500ms',
    },
  })


const
  BusyOverlay = bond(() => {
    const
      busyB = qd.busyB,
      render = () => (
        <div className={busyB() ? css.busyOverlay : css.freeOverlay}>
          <Spinner className={css.centerFullHeight} label='Loading...' size={SpinnerSize.large} />
        </div>
      )
    return { render, busyB }
  }),
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
          case SockEventType.Reset:
            window.location.reload()
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

        return (
          <div className={css.app}>
            <GridLayout key={page.key} page={page} />
            <BusyOverlay />
          </div>
        )
      },
      dispose = () => {
        window.removeEventListener('hashchange', onHashChanged)
      }

    return { init, render, dispose, contentB }
  })

export default App
