import React from 'react';
import { render } from '@testing-library/react';
import { View } from './graphics';
import * as T from './qd';

const
  name = 'graphics',
  graphicsProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Graphics.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...graphicsProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})