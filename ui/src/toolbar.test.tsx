import React from 'react'
import { render } from '@testing-library/react'
import { View } from './toolbar'
import * as T from './qd'

const
  name = 'toolbar',
  toolbarProps: T.Card<any> = {
    name,
    state: { items: [] },
    changed: T.box(false)
  }

describe('Toolbar.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...toolbarProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})