import * as Fluent from '@fluentui/react';
import React from 'react';
import { bond, B, S } from './qd';

/**
  Create a custom cell for boolean values. Show checked icon for true and X icon for false.
*/
export interface DoneTableCellType {
  aa?: S
}

// @ts-ignore
export const XDoneTableCellType = bond(({ model: _m, isDone }: { model: DoneTableCellType, isDone: B }) => {
  const
    render = () => <Fluent.Icon iconName={isDone ? 'BoxCheckmarkSolid' : 'BoxMultiplySolid'} styles={{ root: { fontSize: '1.2rem' } }} />

  return { render }
})