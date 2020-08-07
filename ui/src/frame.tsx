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
 * Create a new inline frame (an `iframe`).
 */
export interface Frame {
  /** The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html` */
  path?: S
  /** The HTML content of the page. A string containing `<html>...</html>`. */
  content?: S
  /** The width of the frame, e.g. `200px`, `50%`, etc. Defaults to `100%`. */
  width?: S
  /** The height of the frame, e.g. `200px`, `50%`, etc. Defaults to `150px`. */
  height?: S
}

/**
 * Render a card containing a HTML page inside an inline frame (an `iframe`).
 *
 * Either a path or content can be provided as arguments.
 */
interface State {
  /** The title for this card.*/
  title: S
  /** The path or URL of the web page, e.g. `/foo.html` or `http://example.com/foo.html` */
  path?: S
  /** The HTML content of the page. A string containing `<html>...</html>` */
  content?: S
}

const
  fixrefs = (s: S): S => {
    // replace ' src="/' -> ' src="http://foo.bar.baz:8080/'
    return s.replace(/(\s+src\s*=\s*["'])\//g, `$1${window.location.protocol}//${window.location.host}/`)
  },
  inline = (s: S): S => `data:text/html;base64,${btoa(fixrefs(s))}`,
  InlineFrame = ({ path, content, width, height }: { path?: S, content?: S, width: S, height: S }) => (
    <iframe title={xid()} src={path ? path : content ? inline(content) : inline('Nothing to render.')} style={{ width, height }} frameBorder="0" />
  )

export const XFrame = ({ model: { path, content, width, height } }: { model: Frame }) => {
  return <InlineFrame path={path} content={content} width={width || '100%'} height={height || '150px'} />
}

const
  View = bond(({ state, changed }: Card<State>) => {
    const render = () => (
      <div className={css.card}>
        <div className={css.title}>{state.title}</div>
        <div className={css.body}>
          <InlineFrame path={state.path} content={state.content} width='100%' height='100%' />
        </div>
      </div>
    )
    return { render, changed }
  })

cards.register('frame', View)
