import React from 'react'
import { render } from '@testing-library/react'
import { View } from './plot'
import * as T from './qd'

const
  name = 'plot',
  plotProps: T.Card<any> = {
    name,
    state: { data: [], plot: { marks: [] } },
    changed: T.box(false)
  }

describe('Plot.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...plotProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})