import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, F, Rec, S } from './telesync';

export interface Spinbox {
  name: S
  label: S
  min: F
  max: F
  step: F
  value: F
  disabled: B
  tooltip: S
}

export const
  XSpinbox = bond(({ args, model: m }: { args: Rec, model: Spinbox }) => {
    args[m.name] = m.value
    const
      parseValue = (v: string) => {
        const x = parseFloat(v)
        return (!isNaN(x) && isFinite(x)) ? x : m.value
      },
      onBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        args[m.name] = parseValue(e.target.value)
      },
      onIncrement = (v: string) => {
        const
          value = parseValue(v),
          newValue = (value + m.step > m.max) ? m.max : value + m.step
        args[m.name] = newValue
        return String(newValue)
      },
      onDecrement = (v: string) => {
        const
          value = parseValue(v),
          newValue = (value - m.step < m.min) ? m.min : value - m.step
        args[m.name] = newValue
        return String(newValue)
      },
      render = () => (
        <Fluent.SpinButton
          data-test={m.name}
          inputProps={{ 'data-test': m.name } as any} // HACK: data-test does not work on root as of this version
          label={m.label}
          min={m.min}
          max={m.max}
          step={m.step}
          defaultValue={`${m.value}`}
          onBlur={onBlur}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disabled={m.disabled}
        />
      )
    return { render }
  })