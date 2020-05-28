import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, Rec, S, U } from './telesync';

export interface DatePicker {
  name: S
  label: S
  placeholder: S
  value: S
  disabled: B
  tooltip: S
}

const
  pad2 = (n: U) => { const s = `${n}`; return s.length === 1 ? `0${s}` : s },
  formatDate = (d: Date): S => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`,
  parseDate = (s: S): Date | undefined => {
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
  XDatePicker = bond(({ args, model: m }: { args: Rec, model: DatePicker }) => {
    args[m.name] = m.value
    const
      onSelectDate = (d: Date | null | undefined) => {
        args[m.name] = (d === null || d === undefined) ? m.value : formatDate(d)
      },
      render = () => (
        <Fluent.DatePicker
          data-test={m.name}
          label={m.label}
          value={parseDate(m.value)}
          placeholder={m.placeholder}
          disabled={m.disabled}
          onSelectDate={onSelectDate}
        />
      )

    return { render }
  })