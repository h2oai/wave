import * as Fluent from '@fluentui/react';
import React from 'react';
import { B, S } from './telesync';

export interface Label {
  label: S
  required: B
  disabled: B
  tooltip: S
}

export const
  XLabel = ({ model: m }: { model: Label }) => (
    <Fluent.Label
      data-test='label'
      required={m.required}
      disabled={m.disabled}
    >{m.label}</Fluent.Label>
  )