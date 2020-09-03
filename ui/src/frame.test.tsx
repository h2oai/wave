import React from 'react';
import { render } from '@testing-library/react';
import { View } from './frame';
import * as T from './qd';

const
  name = 'frame',
  frameProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Frame.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...frameProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})