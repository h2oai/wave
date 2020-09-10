import React from 'react'
import { render } from '@testing-library/react'
import { View } from './list'
import * as T from './qd'

const
  name = 'list',
  listProps: T.Card<any> = {
    name,
    state: { data: [] },
    changed: T.box(false),
  }

describe('List.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...listProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})