import React from 'react';
import { stylesheet } from 'typestyle';
import { cards } from './layout';
import { bond, Card, S, xid } from './qd';
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

/**
 * Render a card containing a HTML page inside an inline frame (iframe).
 *
 * Either a path or content can be provided as arguments.
 */
interface State {
  /** The title for this card.*/
  title: S
  /** The path or URL of the web page, e.g. '/foo.html' or 'http://example.com/foo.html' */
  path?: S
  /** The HTML content of the page. A string containing '<html>...</html>' */
  content?: S
}

const
  fixrefs = (s: S): S => {
    // replace ' src="/' -> ' src="http://foo.bar.baz:8080/'
    return s.replace(/(\s+src\s*=\s*["'])\//g, `$1${window.location.protocol}//${window.location.host}/`)
  },
  inline = (s: S): S => `data:text/html;base64,${btoa(fixrefs(s))}`,
  Frame = ({ source, width, height }: { source: S, width: S, height: S }) => {
    return <iframe title={xid()} src={source} style={{ width, height }} frameBorder="0" />
  }

const
  View = bond(({ state, changed }: Card<State>) => {
    const render = () => (
      <div className={css.card}>
        <div className={css.title}>{state.title}</div>
        <div className={css.body}>
          <Frame source={state.path ? state.path : state.content ? inline(state.content) : inline('Nothing to render.')} width='100%' height='100%' />
        </div>
      </div>
    )
    return { render, changed }
  })

cards.register('frame', View)
