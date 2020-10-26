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

import { Spinner, SpinnerSize } from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import Dialog from './dialog'
import { PageLayout } from './page'
import { bond, box, connect, on, Page, qd, S, SockEvent, SockEventType, SockMessageType } from './qd'
import { clas, cssVar, pc } from './theme'
import * as Fluent from '@fluentui/react'

const
  css = stylesheet({
    app: {
      position: 'absolute',
      left: 0, top: 0, right: 0, bottom: 0,
      backgroundColor: cssVar('page'),
      color: cssVar('text'),
      display: 'flex',
      justifyContent: 'center',
      overflow: 'auto'
    },
    centerFullHeight: {
      height: pc(100),
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: cssVar('page'),
      color: cssVar('text'),
    },
    freeOverlay: {
      display: 'none',
      position: 'fixed',
      left: 0, top: 0, right: 0, bottom: 0,
    },
    busyOverlay: {
      display: 'block',
    },
  })

const
  BusyOverlay = bond(() => {
    let
      spinTimeout = 0
    const
      spinDelay = 500, // ms
      busyB = qd.busyB,
      spinB = box(false),
      render = () => (
        <div className={busyB() ? clas(css.freeOverlay, css.busyOverlay) : css.freeOverlay}>
          <Spinner className={css.centerFullHeight} style={{ opacity: spinB() ? 0.8 : 0 }} label='Loading...' size={SpinnerSize.large} />
        </div>
      )
    on(busyB, busy => {
      window.clearTimeout(spinTimeout)
      if (busy) {
        spinTimeout = window.setTimeout(() => spinB(true), spinDelay)
      } else {
        spinB(false)
      }
    })
    return { render, busyB, spinB }
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
        if (h?.length > 1) {
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
            ? <Spinner label='Waiting for content...' size={SpinnerSize.large} />
            : error
          return <div className={clas(css.centerFullHeight, css.app)}>{errorMessage}</div>
        }
        if (!page) return <Spinner className={css.centerFullHeight} size={SpinnerSize.large} label='Loading ...' />

        return (
          <Fluent.Fabric applyTheme>
            <div className={css.app}>
              <PageLayout key={page.key} page={page} />
              <BusyOverlay />
              <Dialog />
            </div>
          </Fluent.Fabric>
        )
      },
      dispose = () => {
        window.removeEventListener('hashchange', onHashChanged)
      }

    return { init, render, dispose, contentB, theme: qd.theme }
  })

export default App
