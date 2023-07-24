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
import { B, Id, S, U } from 'h2o-wave'
import React from 'react'
import { important } from './theme'
import { wave } from './ui'

/**
 * Create a date picker.
 *
 * A date picker allows a user to pick a date value.
 */
export interface DatePicker {
  /** An identifying name for this component. */
  name: Id
  /** Text to be displayed alongside the component. */
  label?: S
  /** A string that provides a brief hint to the user as to what kind of information is expected in the field. */
  placeholder?: S
  /** The date value in YYYY-MM-DD format. */
  value?: S
  /** True if this field is disabled. */
  disabled?: B
  /** True if the form should be submitted when the datepicker value changes. */
  trigger?: B
  /** The width of the date picker, e.g. '100px'. Defaults to '100%'. */
  width?: S
  /** True if the component should be visible. Defaults to True. */
  visible?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
  /** The minimum allowed date value in YYYY-MM-DD format. */
  min?: S
  /** The maximum allowed date value in YYYY-MM-DD format. */
  max?: S
}

const
  pad2 = (n: U) => { const s = `${n}`; return s.length === 1 ? `0${s}` : s },
  formatDate = (d: Date): S => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
  parseDate = (s: S | null): Date | undefined => {
    if (!s) return undefined
    const ss = s.split('-')
    if (ss.length !== 3) return undefined
    const ymd = ss.map(s => parseInt(s, 10)).filter(n => !isNaN(n))
    if (ymd.length !== 3) return undefined
    return new Date(ymd[0], ymd[1] - 1, ymd[2])
  }

export const
  XDatePicker = ({ model: m }: { model: DatePicker }) => {
    const
      defaultVal = m.value || null,
      parsedVal = defaultVal ? parseDate(defaultVal) : null,
      [value, setValue] = React.useState<Date | undefined>(parsedVal ? new Date(parsedVal) : undefined),
      onSelectDate = (d: Date | null | undefined) => {
        const val = (d === null || d === undefined) ? defaultVal : formatDate(d)
        wave.args[m.name] = val
        setValue(val ? new Date(`${val}T00:00:00`) : undefined)
        if (m.trigger) wave.push()
      }

    React.useEffect(() => {
      wave.args[m.name] = defaultVal
      setValue(parsedVal ? new Date(parsedVal) : undefined)
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [m.value])

    return (
      <Fluent.DatePicker
        data-test={m.name}
        styles={{ icon: { bottom: 2 }, readOnlyTextField: { paddingRight: important('32px') }, statusMessage: { marginTop: 0 } }}
        label={m.label}
        value={value}
        placeholder={m.placeholder}
        disabled={m.disabled}
        onSelectDate={onSelectDate}
        minDate={parseDate(m.min || null)}
        maxDate={parseDate(m.max || null)}
      />
    )
  }