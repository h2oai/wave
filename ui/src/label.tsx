import * as Fluent from '@fluentui/react'
import React from 'react'
import { B, S } from './qd'
import { displayMixin } from './theme'

/**
 * Create a label.
 *
 * Labels give a name or title to a component or group of components.
 * Labels should be in close proximity to the component or group they are paired with.
 * Some components, such as textboxes, dropdowns, or toggles, already have labels
 * incorporated, but other components may optionally add a Label if it helps inform
 * the user of the component’s purpose.
*/
export interface Label {
  /**  The text displayed on the label.*/
  label: S
  /** True if the field is required. */
  required?: B
  /** True if the label should be disabled. */
  disabled?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** An identifying name for this component. */
  name?: S
}

export const
  XLabel = ({ model }: { model: Label }) => {
    const { label, required = false, disabled = false, visible, name } = model
    return (
      <Fluent.Label
        data-test={name}
        style={displayMixin(visible)}
        required={required}
        disabled={disabled}
      >{label}</Fluent.Label>
    )
  }