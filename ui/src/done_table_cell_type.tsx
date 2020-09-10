import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, B, S } from './qd';

/**
  Create a custom cell for boolean values. Show checked icon for true and X icon for false.
*/
export interface DoneTableCellType {
  /** An identifying name for this component. */
  name: S
}

export const XDoneTableCellType = bond(({ model: m, isDone }: { model: DoneTableCellType, isDone: B }) => {
  const
    render = () => <Fluent.Icon data-test={m.name} iconName={isDone ? 'BoxCheckmarkSolid' : 'BoxMultiplySolid'} styles={{ root: { fontSize: '1.2rem' } }} />

  return { render }
})