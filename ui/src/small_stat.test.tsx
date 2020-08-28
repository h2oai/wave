import React from 'react';
import { render } from '@testing-library/react';
import { View } from './small_stat';
import * as T from './qd';

const
  name = 'small-stat',
  smallStatProps: T.Card<any> = {
    name,
    state: {
      data: []
    },
    changed: T.box(false)
  }

describe('SmallStat.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...smallStatProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})