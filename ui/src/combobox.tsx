import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, box, iff, Rec, S } from './telesync';

export interface Combobox {
  name: S
  label: S
  placeholder: S
  value: S
  choices: S[]
  error: S
  disabled: B
  tooltip: S
}


export const
  XCombobox = bond(({ args, model: m }: { args: Rec, model: Combobox }) => {
    args[m.name] = m.value
    const
      textB = box(m.value),
      options = m.choices.map((text, i): Fluent.IComboBoxOption => ({ key: `${i}`, text })),
      onChange = (_e: React.FormEvent<Fluent.IComboBox>, option?: Fluent.IComboBoxOption, _index?: number, value?: string) => {
        const v = option ? option.text : value ? value : ''
        args[m.name] = v
        textB(v)
      },
      render = () => (
        <Fluent.ComboBox
          data-test={m.name}
          label={m.label}
          placeholder={iff(m.placeholder)}
          options={options}
          disabled={m.disabled}
          autoComplete="on"
          allowFreeform
          errorMessage={iff(m.error)}
          text={textB()}
          onChange={onChange}
        />
      )
    return { render, textB }
  })