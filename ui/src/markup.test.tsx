import React from 'react';
import { render } from '@testing-library/react';
import { View } from './markup';
import * as T from './qd';

const
  name = 'markup',
  markup_props: T.Card<any> = {
    name,
    state: { content: '' },
    changed: T.box(false)
  }

describe('Markup.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...markup_props} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})