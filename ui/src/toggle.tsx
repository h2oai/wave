import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, S, qd } from './qd';

/**
 * Create a toggle.
 * Toggles represent a physical switch that allows users to turn things on or off.
 * Use toggles to present users with two mutually exclusive options (like on/off), where choosing an option results
 * in an immediate action.
 *
 * Use a toggle for binary operations that take effect right after the user flips the Toggle.
 * For example, use a Toggle to turn services or hardware components on or off.
 * In other words, if a physical switch would work for the action, a Toggle is probably the best component to use.
 */
export interface Toggle {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed alongside the component. */
  label?: S
  /** True if selected, False if unselected. */
  value?: B
  /** True if the checkbox is disabled. */
  disabled?: B
  /** True if the form should be submitted when the toggle value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XToggle = bond(({ model: m }: { model: Toggle }) => {
    qd.args[m.name] = m.value ? true : false
    const
      onChange = (_e?: React.FormEvent<HTMLElement>, checked?: boolean) => {
        qd.args[m.name] = checked ? true : false
        if (m.trigger) qd.sync()
      },
      render = () => (
        <Fluent.Toggle
          data-test={m.name}
          label={m.label}
          defaultChecked={m.value}
          onChange={onChange}
          disabled={m.disabled}
          onText="On"
          offText="Off"
          inlineLabel
        />
      )

    return { render }
  })