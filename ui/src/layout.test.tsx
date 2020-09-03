import React from 'react';
import { render } from '@testing-library/react';
import { GridLayout } from './layout';
import * as T from './qd';

const
  name = 'layout',
  layoutProps: T.Page = {
    key: name,
    changed: T.box(false),
    add: jest.fn(),
    get: jest.fn(),
    set: jest.fn(),
    list: jest.fn().mockImplementation(() => []),
    drop: jest.fn(),
    sync: jest.fn(),
  }

describe('Layout.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<GridLayout page={layoutProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})