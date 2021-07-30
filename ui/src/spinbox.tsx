// Copyright 2020 H2O.ai, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import * as Fluent from '@fluentui/react'
import { B, box, F, Id, S } from 'h2o-wave'
import React from 'react'
import { bond, debounce, wave } from './ui'

/**
 * Create a spinbox.
 *
 * A spinbox allows the user to incrementally adjust a value in small steps.
 * It is mainly used for numeric values, but other values are supported too.
 */
export interface Spinbox {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** The minimum value of the spinbox. Defaults to "0". */
  min?: F
  /** The maximum value of the spinbox. Defaults to "100". */
  max?: F
  /** The difference between two adjacent values of the spinbox. Defaults to "1". */
  step?: F
  /** The current value of the spinbox. Defaults to "0". */
  value?: F
  /** True if this field is disabled. */
  disabled?: B
  /** True if the component should be visible. Defaults to true. */
  visible?: B
  /** True if the form should be submitted when the spinbox value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const DEBOUNCE_TIMEOUT = 500
export const
  XSpinbox = bond(({ model: { name, trigger, label, disabled, min = 0, max = 100, step = 1, value = 0 } }: { model: Spinbox }) => {
    wave.args[name] = (value < min) ? min : ((value > max) ? max : value)

    const
      valueB = box<S | undefined>(),
      parseValue = (v: S) => {
        const x = parseFloat(v)
        return (!isNaN(x) && isFinite(x)) ? x : value
      },
      onIncrement = (v: S) => {
        const
          value = parseValue(v),
          newValue = (value + step > max) ? max : value + step
        wave.args[name] = newValue
        if (trigger) wave.push()
        return String(newValue)
      },
      onDecrement = (v: S) => {
        const
          value = parseValue(v),
          newValue = (value - step < min) ? min : value - step
        wave.args[name] = newValue
        if (trigger) wave.push()
        return String(newValue)
      },
      handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const
          value = parseValue(e.target.value),
          newValue = value > max
            ? max
            : value < min
              ? min
              : value
        wave.args[name] = newValue
        if (trigger) wave.push()
        valueB(String(newValue))
      },
      debouncedHandleOnchange = debounce(DEBOUNCE_TIMEOUT, handleOnChange),
      onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.persist()
        trigger ? debouncedHandleOnchange(e) : handleOnChange(e)
      },
      render = () => (
        <Fluent.SpinButton
          inputProps={{ 'data-test': name, onChange } as React.InputHTMLAttributes<HTMLInputElement>}
          label={label}
          min={min}
          max={max}
          step={step}
          defaultValue={String(value)}
          value={valueB()}
          onIncrement={onIncrement}
          onDecrement={onDecrement}
          disabled={disabled}
        />
      )
    return { render, valueB }
  })