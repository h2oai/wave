import React from 'react';
import { cards } from './layout';
import { bond, Card, S, Rec, unpack } from './telesync';
import vegaEmbed from 'vega-embed';
import { getTheme } from './theme';
import { stylesheet } from 'typestyle';

const
  theme = getTheme(),
  css = stylesheet({
    card: {
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    plot: {
      position: 'absolute',
      left: 0, top: 30, right: 0, bottom: 0,
    },
  })

export const
  VegaLite = bond(({ spec, data }: { spec: any, data?: any[] }) => {
    const
      ref = React.createRef<HTMLDivElement>(),
      init = async () => {
        if (!ref.current) {
          window.setTimeout(init, 500)
          return
        }

        if (data) spec.data = { values: data }
        try {
          await vegaEmbed(ref.current, spec, {
            mode: 'vega-lite',
            defaultStyle: false,
            renderer: 'canvas',
            actions: false,
          })
        } catch (e) {
          console.error(e)
        }
      },
      render = () => {
        return <div className={css.plot} ref={ref} />
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

const
  View = bond(({ state, changed }: Card<State>) => {
    const
      render = () => {
        const data = unpack<any[]>(state.data)
        return (
          <div className={css.card}>
            <div className={css.title}>{state.title}</div>
            <VegaLite spec={JSON.parse(state.specification)} data={data} />
          </div>
        )
      }
    return { render, changed }
  })

cards.register('vega', View)

