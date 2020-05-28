import * as Fluent from '@fluentui/react';
import React from 'react';
import { F, S } from './telesync';

export interface Progress {
  label: S
  caption: S
  value: F
  tooltip: S
}

export const
  XProgress = ({ model: m }: { model: Progress }) => (
    <Fluent.ProgressIndicator
      data-test='progress' // TODO: Does not work.
      label={m.label}
      description={m.caption}
      percentComplete={m.value < 0 ? undefined : m.value}
    />
  )