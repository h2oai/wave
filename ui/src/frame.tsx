import React from 'react';
import { stylesheet } from 'typestyle';
import { cards } from './layout';
import { bond, Card, S, xid } from './telesync';
import { getTheme } from './theme';

const
  theme = getTheme(),
  css = stylesheet({
    card: {
      position: 'absolute', left: 0, top: 0, right: 0, bottom: 0,
    },
    title: {
      ...theme.font.s12,
      ...theme.font.w6,
    },
    body: {
      position: 'absolute', left: 0, top: 20, right: 0, bottom: 0,
    },
  })

/** Render a HTML page inside an iframe. */
interface State {
  /** The title for this card.*/
  title: S
  /** The HTML page. */
  content: S
}

const
  fixrefs = (s: S): S => {
    // replace ' src="/' -> ' src="http://foo.bar.baz:8080/'
    return s.replace(/(\s+src\s*=\s*["'])\//g, `$1${window.location.protocol}//${window.location.host}/`)
  },
  Frame = ({ source, width, height }: { source: S, width: S, height: S }) => {
    const src = `data:text/html;base64,${btoa(fixrefs(source))}`
    return <iframe title={xid()} src={src} style={{ width, height, border: 'none' }} />
  }

const
  View = bond(({ state, changed }: Card<State>) => {
    const render = () => (
      <div className={css.card}>
        <div className={css.title}>{state.title}</div>
        <div className={css.body}>
          <Frame source={state.content} width='100%' height='100%' />
        </div>
      </div>
    )
    return { render, changed }
  })

cards.register('frame', View)
