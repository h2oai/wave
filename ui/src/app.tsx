// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { box, WaveErrorCode, WaveEventType } from './core'
import React from 'react'
import { stylesheet } from 'typestyle'
import Dialog from './dialog'
import { LayoutPicker } from './editor'
import { Logo } from './logo'
import { NotificationBar } from './notification_bar'
import { PageLayout } from './page'
import { Lightbox, lightboxB } from './parts/lightbox'
import SidePanel from './side_panel'
import { clas, cssVar, pc } from './theme'
import { bond, busyB, config, contentB, listen, wave } from './ui'

const
  css = stylesheet({
    app: {
      position: 'absolute',
      left: 0, top: 0, right: 0, bottom: 0,
      backgroundColor: cssVar('$page'),
      color: cssVar('$text'),
      display: 'flex',
      justifyContent: 'center',
      overflow: 'auto'
    },
    centerFullHeight: {
      height: pc(100),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cssVar('$page'),
      color: cssVar('$text'),
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
      zIndex: 999,
      transition: 'opacity 500ms 500ms',
    },
    notFoundOverlay: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  }),
  buttonStyles = { styles: { iconDisabled: { color: 'unset' } } },
  // The global overrides for component styles.
  customStyles = {
    components: {
      DefaultButton: buttonStyles,
      PrimaryButton: buttonStyles,
      IconButton: buttonStyles,
      ActionButton: buttonStyles,
      CommandButton: buttonStyles,
      CommandBarButton: buttonStyles,
      CompoundButton: buttonStyles,
      SpinButton: buttonStyles
    }
  }

const
  BusyOverlay = bond(() => {
    const
      render = () => (
        <div className={busyB() ? css.busyOverlay : css.freeOverlay}>
          <Fluent.Spinner className={css.centerFullHeight} label='Loading...' size={Fluent.SpinnerSize.large} />
        </div>
      )
    return { render, busyB }
  }),
  NotFoundOverlay = bond(() => {
    const
      pickingLayoutB = box(false),
      onClick = () => {
        pickingLayoutB(true)
      },
      render = () => (
        <div className={css.notFoundOverlay}>
          <Logo />
          {config.editable && (
            <>
              <Fluent.DefaultButton onClick={onClick} >Edit this page...</Fluent.DefaultButton>
              <LayoutPicker visibleB={pickingLayoutB} />
            </>
          )}
        </div>
      )

    return { render }
  }),
  App = bond(() => {
    const
      onHashChanged = () => {
        const h = window.location.hash
        if (h?.length > 1) wave.args['#'] = h.substring(1)
        wave.push()
      },
      onMdLinkClick = ({ detail }: any) => {
        wave.args[detail] = true
        wave.push()
      },
      init = () => {
        listen(wave.socketURL)
        window.addEventListener('hashchange', onHashChanged)
        window.addEventListener('md-link-click', onMdLinkClick)
      },
      render = () => {
        const e = contentB()
        if (e) {
          switch (e.t) {
            case WaveEventType.Page:
              {
                const page = e.page
                const lightbox = lightboxB()
                return (
                  <Fluent.ThemeProvider theme={customStyles}>
                    <div className={css.app}>
                      <PageLayout key={page.key} page={page} />
                      <BusyOverlay />
                      <Dialog />
                      <SidePanel />
                      <NotificationBar />
                      {lightbox && <Lightbox {...lightbox} />}
                    </div>
                  </Fluent.ThemeProvider>
                )
              }
            case WaveEventType.Error:
              {
                // TODO better sadface
                const message = e.code === WaveErrorCode.PageNotFound ? <NotFoundOverlay /> : 'Unknown Remote Error'
                return <div className={clas(css.centerFullHeight, css.app)}>{message}</div>
              }
            case WaveEventType.Exception:
              {
                // TODO better sadface
                const message = `Unhandled exception: ${e.error}`
                return <div className={clas(css.centerFullHeight, css.app)}>{message}</div>
              }
            case WaveEventType.Disconnect:
              {
                // TODO better sadface
                const message = `Disconnected. Reconnecting in ${e.retry}s`
                return (
                  <div className={clas(css.centerFullHeight, css.app, css.notFoundOverlay)}>
                    <div>{message}</div>
                    <div>Make sure your Wave server is running and the environment network policies allow websocket connections.</div>
                  </div>
                )
              }
          }
        }
        return <Fluent.Spinner className={css.centerFullHeight} size={Fluent.SpinnerSize.large} label='Loading ...' />
      },
      dispose = () => {
        window.removeEventListener('hashchange', onHashChanged)
        window.removeEventListener('md-link-click', onMdLinkClick)
      }

    return { init, render, dispose, contentB, lightboxB }
  })

export default App
