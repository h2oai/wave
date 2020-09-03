import React from 'react';
import { render } from '@testing-library/react';
import { View } from './template';
import * as T from './qd';

const
  name = 'template',
  templateProps: T.Card<any> = {
    name,
    state: { data: [] },
    changed: T.box(false)
  }

describe('Template.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...templateProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})