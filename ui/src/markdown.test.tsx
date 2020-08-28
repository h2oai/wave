import React from 'react';
import { render } from '@testing-library/react';
import { View } from './markdown';
import * as T from './qd';

const
  name = 'markdown',
  markdown_props: T.Card<any> = {
    name,
    state: { content: '' },
    changed: T.box(false)
  }

describe('Markdown.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...markdown_props} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})