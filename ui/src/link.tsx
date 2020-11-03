import * as Fluent from '@fluentui/react'
import React from 'react'
import { B, bond, S } from './qd'
import { displayMixin } from './theme'

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
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** Where to display the link. Setting this to an empty string or `'_blank'` opens the link in a new tab or window. */
  target?: S
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

export const
  XLink = bond(({ model: m }: { model: Link }) => {
    const
      label = m.label || m.path,
      target = m.target === '' ? '_blank' : m.target,
      onClick = () => target ? window.open(m.path, target) : window.open(m.path),
      render = () => (
        <div style={displayMixin(m.visible)}>
          {
            m.button
              ? <Fluent.DefaultButton data-test={m.name} text={label} disabled={m.disabled} onClick={onClick} />
              : <Fluent.Link
                data-test={m.name}
                href={m.path}
                download={m.download}
                disabled={m.disabled}
                target={target}>
                {label}
              </Fluent.Link>
          }
        </div>
      )
    return { render }
  })