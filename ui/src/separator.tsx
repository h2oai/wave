import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { S } from './telesync';
import { px } from './theme';

const
  css = stylesheet({
    separator: {
      boxSizing: 'border-box',
      paddingTop: px(20),
    },
  })

export interface Separator {
  label: S
}

export const
  XSeparator = ({ model: m }: { model: Separator }) => (
    <div className={css.separator}>
      <Fluent.Separator data-test='separator'>{m.label}</Fluent.Separator>
    </div>
  ) 