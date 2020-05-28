import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, bond, S } from './telesync';

export interface Link {
  label: S
  path: S
  disabled: B
  button: B
  tooltip: S
}

export const
  XLink = bond(({ model: m }: { model: Link }) => {
    const
      label = m.label.length ? m.label : m.path,
      onClick = m.button ? () => { window.open(m.path) } : null,
      render = () => {
        // TODO target="_blank"
        return onClick
          ? <div><Fluent.DefaultButton text={label} disabled={m.disabled} onClick={onClick} /></div>
          : <div><Fluent.Link data-test='link' href={m.path} disabled={m.disabled}>{label}</Fluent.Link></div>
      }
    return { render }
  })