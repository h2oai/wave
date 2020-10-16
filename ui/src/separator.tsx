import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { S, B } from './qd'
import { displayMixin } from './theme'

const
  css = stylesheet({
    separator: {
      boxSizing: 'border-box',
    },
  })

/**
 * Create a separator.
 *
 * A separator visually separates content into groups.
 */
export interface Separator {
  /** The text displayed on the separator. */
  label?: S
  /** An identifying name for this component. */
  name?: S
  /** Controls visibility of the component. Persists component state on show/hide. Defaults to true. */
  visible?: B
}

export const
  XSeparator = ({ model: m }: { model: Separator }) => (
    <div data-test={m.name} className={css.separator} style={displayMixin(m.visible)}>
      <Fluent.Separator>{m.label}</Fluent.Separator>
    </div>
  )