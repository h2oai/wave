import * as Fluent from '@fluentui/react';
import React from 'react';
import { stylesheet } from 'typestyle';
import { S } from './qd';
import { px } from './theme';

const
  css = stylesheet({
    separator: {
      boxSizing: 'border-box',
      paddingTop: px(20),
    },
  })

/**
 * Create a separator.
 *
 * A separator visually separates content into groups.
 */
export interface Separator {
  /** The text displayed on the separator. */
  label?: S
}

export const
  XSeparator = ({ model: m }: { model: Separator }) => (
    <div className={css.separator}>
      <Fluent.Separator data-test='separator'>{m.label}</Fluent.Separator>
    </div>
  )