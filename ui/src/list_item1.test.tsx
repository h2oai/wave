import React from 'react';
import { render } from '@testing-library/react';
import { View } from './list_item1';
import * as T from './qd';

const
  name = 'list-item-1',
  list_item_props: T.Card<any> = {
    name,
    state: { data: [] },
    changed: T.box(false)
  }

describe('ListItem1.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...list_item_props} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})