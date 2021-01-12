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

import React from 'react'
import { stylesheet } from 'typestyle'
import vegaEmbed from 'vega-embed'
import { cards, grid } from './layout'
import { B, bond, Card, Rec, S, unpack, xid } from './qd'
import { displayMixin, getTheme } from './theme'

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: grid.gap,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    body: {
      flexGrow: 1,
      position: 'relative',
    },
  })

/** Create a Vega-lite plot for display inside a form. */
export interface VegaVisualization {
  /** The Vega-lite specification. */
  specification: S
  /** Data for the plot, if any. */
  data?: Rec
  /** The width of the visualization. Defaults to 100%. */
  width?: S
  /** The height of the visualization. Defaults to 300px. */
  height?: S
  /** An identifying name for this component. */
  name?: S
  /** True if the component should be visible. Defaults to true. */
  visible?: B
}

export const
  XVegaVisualization = bond(({ model: state }: { model: VegaVisualization }) => {
    const
      ref = React.createRef<HTMLDivElement>(),
      init = async () => {
        if (!ref.current) {
          window.setTimeout(init, 500)
          return
        }

        const
          spec = JSON.parse(state.specification),
          data = unpack<any[]>(state.data)

        if (data) spec.data = { values: data }
        try {
          await vegaEmbed(ref.current, spec, {
            mode: 'vega-lite',
            defaultStyle: false,
            renderer: 'canvas',
            actions: false,
            config: {
              autosize: {
                type: 'fit',
                resize: true
              },
              view: {
                discreteWidth: ref.current.clientWidth || undefined,
                discreteHeight: ref.current.clientHeight || undefined,
                continuousWidth: ref.current.clientWidth || 200,
                continuousHeight: ref.current.clientHeight || 200,
              }
            }
          })
        } catch (e) {
          console.error(e)
        }
      },
      render = () => {
        const
          { name, width, height, visible } = state,
          style: React.CSSProperties = (width === 'auto' && height === 'auto')
            ? { position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }
            : { width: width || 'auto', height: height || 'auto' }
        return <div data-test={name} style={{ ...style, ...displayMixin(visible) }} ref={ref} />
      }

    return { init, render }
  })

/** Create a card containing a Vega-lite plot. */
interface State {
  /** The title of this card. */
  title: S
  /** The Vega-lite specification. */
  specification: S
  /** Data for the plot, if any. */
  data?: Rec
}

export const
  View = bond(({ name, state, changed }: Card<State>) => {
    const
      render = () => {
        return (
          <div data-test={name} className={css.card}>
            <div className={css.title}>{state.title}</div>
            <div className={css.body}>
              <XVegaVisualization key={xid()} model={{ specification: state.specification, data: state.data, width: 'auto', height: 'auto' }} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('vega', View)

