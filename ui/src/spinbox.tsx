import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, F, S, qd } from './qd';

/**
 * Create a spinbox.
 *
 * A spinbox allows the user to incrementally adjust a value in small steps.
 * It is mainly used for numeric values, but other values are supported too.
 */
export interface Spinbox {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed alongside the component. */
  label?: S
  /** The minimum value of the spinbox. */
  min?: F
  /** The maximum value of the spinbox. */
  max?: F
  /** The difference between two adjacent values of the spinbox. */
  step?: F
  /** The current value of the spinbox. */
  value?: F
  /** True if this field is disabled. */
  disabled?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

export const
  XSpinbox = bond(({ model: m }: { model: Spinbox }) => {
    const
      min = m.min || 0,
      max = m.max || 100,
      step = m.step || 1,
      value = m.value || 0

    const defaultValue = (value < min) ? min : ((value > max) ? max : value)

    qd.args[m.name] = defaultValue

    const
      parseValue = (v: string) => {
        const x = parseFloat(v)
        return (!isNaN(x) && isFinite(x)) ? x : value
      },
      onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        qd.args[m.name] = parseValue(e.target.value)
      },
      onIncrement = (v: string) => {
        const
          value = parseValue(v),
          newValue = (value + step > max) ? max : value + step
        qd.args[m.name] = newValue
        return String(newValue)
      },
      onDecrement = (v: string) => {
        const
          value = parseValue(v),
          newValue = (value - step < min) ? min : value - step
        qd.args[m.name] = newValue
        return String(newValue)
      },
      render = () => (
        <Fluent.SpinButton
          inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
          label={m.label}
          min={min}
          max={max}
          step={step}
          defaultValue={`${value}`}
          onBlur={onBlur}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disabled={m.disabled}
        />
      )
    return { render }
  })