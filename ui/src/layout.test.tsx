import { render } from '@testing-library/react'
import React from 'react'
import { GridLayout } from './layout'

const name = 'layout'

describe('Layout.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<GridLayout name={name} cards={[]} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})