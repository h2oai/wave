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

import { B, Model, Rec, S, unpack } from 'h2o-wave'
import React from 'react'
import { stylesheet } from 'typestyle'
import { Result } from 'vega-embed'
import { cards } from './layout'
import { formItemWidth } from './theme'
import { bond, debounce } from './ui'
import { Command } from './toolbar'
import { CARD_TITLE_HEIGHT, CARD_TITLE_PADDING_TOP } from './parts/styleConstants'

const
  css = stylesheet({
    card: {
      display: 'flex',
      flexDirection: 'column',
      padding: 24
    },
    body: {
      flexGrow: 1,
      display: 'flex',
    },
    plot: {
      $nest: {
        'canvas': {
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0
        }
      }
    }
  })

/** Create a Vega-lite plot for display inside a form. */
export interface VegaVisualization {
  /** The Vega-lite specification. */
  specification: S
  /** Data for the plot, if any. */
  data?: Rec
  /** The width of the visualization. Defaults to '100%'. */
  width?: S
  /** The height of the visualization. Defaults to '300px'. */
  height?: S
  /** An identifying name for this component. */
  name?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** Vega grammar to use. Defaults to 'vega-lite'. */
  grammar?: 'vega-lite' | 'vega'
}

export const
  XVegaVisualization = ({ model }: { model: VegaVisualization }) => {
    const
      ref = React.useRef<HTMLDivElement>(null),
      vegaRef = React.useRef<Result>(),
      dataRef = React.useRef<unknown[]>(unpack<unknown[]>(model.data)),
      updateData = React.useCallback(async () => {
        if (!vegaRef.current || !dataRef.current) return

        const changeset = (await import('vega')).changeset().remove(() => true).insert(dataRef.current)
        // source_0 is default dataset for some reason in Vega.
        vegaRef.current.view.change('source_0', changeset).run()
      }, []),
      init = React.useCallback(async () => {
        const el = ref.current
        if (!el) return

        const spec = JSON.parse(model.specification)
        // HACK: Vega calculates dimensions with extra 10px for some reason, increase container for 10px as well.
        if (!isNaN(spec.height)) el.style.height = `${spec.height + 10}px`
        // If card does not have specified height, it uses content. Since the wrapper is empty, it takes very little space - set to 300px by default.
        else if (el.clientHeight < 30) el.style.height = '300px'

        const
          width = el.clientWidth - 10, // HACK: Vega calculates dimensions with extra 10px for some reason.
          height = el.clientHeight - 10 // HACK: Vega calculates dimensions with extra 10px for some reason.

        if (dataRef.current) spec.data = { values: dataRef.current }
        const { default: vegaEmbed } = await import('vega-embed')
        vegaRef.current = await vegaEmbed(el, spec, {
          mode: model.grammar || 'vega-lite',
          defaultStyle: false,
          renderer: 'canvas',
          actions: false,
          config: {
            autosize: {
              type: 'fit',
              resize: true
            },
            view: {
              discreteWidth: width,
              discreteHeight: height,
              continuousWidth: width,
              continuousHeight: height,
            }
          }
        })
      }, [model.grammar, model.specification]),
      { name, width = 'auto', height = 'auto' } = model,
      style: React.CSSProperties = (width === 'auto' && height === 'auto')
        ? { flexGrow: 1 }
        : { width: formItemWidth(width), height }

    React.useEffect(() => {
      dataRef.current = unpack<unknown[]>(model.data)
      updateData()
    }, [updateData, model.data, model])
    React.useEffect(() => {
      init()
      const onResize = debounce(1000, init)
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }, [init])

    return <div data-test={name} className={css.plot} style={{ ...style, position: 'relative' }} ref={ref} />
  }

/** Create a card containing a Vega-lite plot. */
interface State {
  /** The title of this card. */
  title: S
  /** The Vega-lite specification. */
  specification: S
  /** Data for the plot, if any. */
  data?: Rec
  /** Vega grammar to use. Defaults to 'vega-lite'. */
  grammar?: 'vega-lite' | 'vega'
}

export const
  View = bond(({ name, state, changed }: Model<State & { commands?: Command[] }>) => {
    const
      render = () => {
        const { specification, data, title, grammar = 'vega-lite', commands } = state
        return (
          <div data-test={name} className={css.card}>
            {title && <div className='wave-s12 wave-w6'>{title}</div>}
            <div
              className={css.body}
              style={{ paddingTop: title ? CARD_TITLE_PADDING_TOP : commands?.length ? CARD_TITLE_PADDING_TOP + CARD_TITLE_HEIGHT : 0 }}
            >
              <XVegaVisualization model={{ specification, data, grammar }} />
            </div>
          </div>
        )
      }
    return { render, changed }
  })

cards.register('vega', View)