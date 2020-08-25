import * as Fluent from '@fluentui/react'
import React from 'react'
import { B, bond, S, qd, U } from './qd'

/**
 * Create a date picker.
 *
 * A date picker allows a user to pick a date value.
 */
export interface DatePicker {
  /** An identifying name for this component. */
  name: S
  /** Text to be displayed alongside the component. */
  label?: S
  /** A string that provides a brief hint to the user as to what kind of information is expected in the field. */
  placeholder?: S
  /** The date value in YYYY-MM-DD format. */
  value?: S
  /** True if this field is disabled. */
  disabled?: B
  /** An optional tooltip message displayed when a user clicks the help icon to the right of the component. */
  tooltip?: S
}

const
  pad2 = (n: U) => { const s = `${n}`; return s.length === 1 ? `0${s}` : s },
  formatDate = (d: Date): S => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
  parseDate = (s: S | null): Date | undefined => {
    if (s && s.length) {
      const ss = s.split('-')
      if (ss.length !== 3) return undefined
      const ymd = ss.map(s => parseInt(s, 10)).filter(n => !isNaN(n))
      if (ymd.length !== 3) return undefined
      return new Date(ymd[0], ymd[1] - 1, ymd[2])
    }
    return undefined
  }

export const
  XDatePicker = bond(({ model: m }: { model: DatePicker }) => {
    const value = m.value || null
    qd.args[m.name] = value
    const
      onSelectDate = (d: Date | null | undefined) => {
        qd.args[m.name] = (d === null || d === undefined) ? value : formatDate(d)
      },
      render = () => (
        <Fluent.DatePicker
          data-test={m.name}
          label={m.label}
          value={parseDate(value)}
          placeholder={m.placeholder}
          disabled={m.disabled}
          onSelectDate={onSelectDate}
        />
      )

    return { render }
  })