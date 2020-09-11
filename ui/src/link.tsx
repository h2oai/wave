import * as Fluent from '@fluentui/react'
import React from 'react'
import { B, bond, S } from './qd'

/**
 * Create a hyperlink.
 *
 * Hyperlinks can be internal or external.
 * Internal hyperlinks have paths that begin with a `/` and point to URLs within the Q UI.
 * All other kinds of paths are treated as external hyperlinks.
 */
export interface Link {
  /** The text to be displayed. If blank, the `path` is used as the label. */
  label?: S
  /** The path or URL to link to. */
  path?: S
  /** True if the link should be disabled. */
  disabled?: B
  /** True if the link should be used for file download. */
  download?: B
  /** True if the link should be rendered as a button. */
  button?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XLink = bond(({ model: m }: { model: Link }) => {
    const
      label = m.label || m.path,
      onClick = () => { window.open(m.path) },
      render = () => {
        // TODO target="_blank"
        return m.button
          ? <div><Fluent.DefaultButton data-test='link' text={label} disabled={m.disabled} onClick={onClick} /></div>
          : <div><Fluent.Link data-test='link' href={m.path} download={m.download || undefined} disabled={m.disabled}>{label}</Fluent.Link></div>
      }
    return { render }
  })