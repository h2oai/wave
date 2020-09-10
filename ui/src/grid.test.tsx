import React from 'react'
import { render } from '@testing-library/react'
import { View } from './grid'
import * as T from './qd'

const
  name = 'grid',
  gridProps: T.Card<any> = {
    name,
    state: { data: [] },
    changed: T.box(false)
  }

describe('Grid.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...gridProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})