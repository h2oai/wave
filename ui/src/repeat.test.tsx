import React from 'react';
import { render } from '@testing-library/react';
import { View } from './repeat';
import * as T from './qd';

const
  name = 'repeat',
  repeatProps: T.Card<any> = {
    name,
    state: {
      data: [],
      item_view: 'list_item1',
      item_props: ''
    },
    changed: T.box(false)
  }

describe('Repeat.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...repeatProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})