import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, iff, Rec, S } from './telesync';

export interface Textbox {
  name: S
  label: S
  placeholder: S
  mask: S
  icon: S
  prefix: S
  suffix: S
  value: S
  error: S
  required: B
  disabled: B
  readonly: B
  multiline: B
  password: B
  tooltip: S
}

export const
  XTextbox = bond(({ args, model: m }: { args: Rec, model: Textbox }) => {
    args[m.name] = m.value
    const
      icon: Fluent.IIconProps | undefined = m.icon && m.icon.length ? { iconName: m.icon } : undefined,
      onChange = (_e: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, v?: string) => {
        args[m.name] = (v !== undefined && v !== null) ? v : m.value
      },
      mask = iff(m.mask),
      password = m.password ? 'password' : undefined,
      render = () => mask
        ? (
          <Fluent.MaskedTextField
            data-test={m.name}
            label={m.label}
            defaultValue={m.value}
            mask={mask}
            errorMessage={iff(m.error)}
            required={m.required}
            disabled={m.disabled}
            readOnly={m.readonly}
            onChange={onChange}
          />
        )
        : (
          <Fluent.TextField
            data-test={m.name}
            label={m.label}
            placeholder={iff(m.placeholder)}
            iconProps={icon}
            prefix={iff(m.prefix)}
            suffix={iff(m.suffix)}
            defaultValue={m.value}
            errorMessage={iff(m.error)}
            required={m.required}
            disabled={m.disabled}
            readOnly={m.readonly}
            multiline={m.multiline}
            type={password}
            onChange={onChange}
          />
        )

    return { render }
  })