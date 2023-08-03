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
import { B, F, Id, S, U } from 'h2o-wave'
import React from 'react'
import { wave } from './ui'

/**
 * Create a spinbox.
 *
 * A spinbox allows the user to incrementally adjust a value in small steps.
 */
export interface Spinbox {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** The minimum value of the spinbox. Defaults to 0. */
  min?: F
  /** The maximum value of the spinbox. Defaults to 100. */
  max?: F
  /** The difference between two adjacent values of the spinbox. Defaults to 1. */
  step?: F
  /** The current value of the spinbox. Defaults to 0. */
  value?: F
  /** True if this field is disabled. */
  disabled?: B
  /** The width of the spinbox, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** True if the form should be submitted when the spinbox value changes. */
  trigger?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}
const
  DEBOUNCE_TIMEOUT = 500,
  precisionRound = (value: F, precision: F) => {
    const exp = Math.pow(10, precision)
    return Math.round(value * exp) / exp
  },
  // Source: https://github.com/microsoft/fluentui/blob/ecb0e9b12665a05353f64f1b69981584c3addbc0/packages/utilities/src/math.ts#L91.
  calculatePrecision = (value: F) => {
    /**
     * Group 1:
     * [1-9]([0]+$) matches trailing zeros
     * Group 2:
     * \.([0-9]*) matches all digits after a decimal point.
     */
    const groups = /[1-9]([0]+$)|\.([0-9]*)/.exec(String(value))
    if (!groups) return 0
    return -groups[1]?.length || groups[2]?.length || 0
  }
export const
  XSpinbox = ({ model: m }: { model: Spinbox }) => {
    const
      { name, trigger, label, disabled, min = 0, max = 100, step = 1, value = 0 } = m,
      [val, setVal] = React.useState<S>(String(value)),
      precision = Math.max(calculatePrecision(step), 0),
      parseValue = React.useCallback((v: F) => {
        const x = precisionRound(v, precision)
        return (!isNaN(x) && isFinite(x)) ? x : value
      }, [precision, value]),
      onIncrement = () => {
        const newValue = Math.min(parseValue(Number(val) + step), max)
        wave.args[name] = newValue
        if (trigger) wave.push()
        setVal(String(newValue))
        m.value = newValue
        return String(newValue)
      },
      onDecrement = () => {
        const newValue = Math.max(parseValue(Number(val) - step), min)
        wave.args[name] = newValue
        if (trigger) wave.push()
        setVal(String(newValue))
        m.value = newValue
        return String(newValue)
      },
      handleValue = React.useCallback((val: S) => {
        const
          isLastCharDotOrTraillingZero = /\.$|\.\d*0+$/,
          value = parseValue(Number(val)),
          newValue = value > max
            ? max
            : value < min
              ? min
              : value
        if (val === '-') setVal('-')
        else if (!precision) setVal(String(newValue).split('.')[0])
        else if (isLastCharDotOrTraillingZero.test(val)) {
          // We can't use parseValue because it requires casting to number which will remove the trailling zeros.
          const [head, tail = ''] = val.split('.')
          setVal(`${head}.${tail.slice(0, precision)}`)
        }
        else setVal(String(newValue))
        return newValue
      }, [max, min, parseValue, precision]),
      handleOnInput = React.useCallback((val: U) => {
        wave.args[name] = val
        if (trigger) wave.push()
      }, [name, trigger]),
      debouncedHandleOnInput = React.useRef(wave.debounce(DEBOUNCE_TIMEOUT, handleOnInput)),
      onInput = (e: React.SyntheticEvent<HTMLElement>) => {
        const inputValue = (e.target as HTMLInputElement).value
        const numVal = handleValue(inputValue)
        if (String(numVal) === inputValue) m.value = numVal
        trigger ? debouncedHandleOnInput.current(numVal) : handleOnInput(numVal)
      }

    React.useEffect(() => {
      const val = (value < min) ? min : ((value > max) ? max : value)
      wave.args[name] = val
      setVal(String(val))
    }, [max, min, name, value])

    return (
      <Fluent.SpinButton
        inputProps={{ 'data-test': name, value: val } as React.InputHTMLAttributes<HTMLInputElement>}
        label={label}
        onInput={onInput}
        min={min}
        max={max}
        step={step}
        onIncrement={onIncrement}
        onDecrement={onDecrement}
        disabled={disabled}
      />
    )
  }