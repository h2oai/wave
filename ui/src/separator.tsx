import * as Fluent from '@fluentui/react'
import React from 'react'
import { stylesheet } from 'typestyle'
import { S } from './qd'

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
}

export const
  XSeparator = ({ model: m }: { model: Separator }) => (
    <div data-test={m.name} className={css.separator}>
      <Fluent.Separator>{m.label}</Fluent.Separator>
    </div>
  )