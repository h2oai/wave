import React from 'react'
import { render } from '@testing-library/react'
import { View } from './none'
import * as T from './qd'

const
  name = 'none',
  noneProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('None.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...noneProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})