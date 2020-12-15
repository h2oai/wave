import React from 'react'
import { render } from '@testing-library/react'
import { View } from './form'
import * as T from './qd'

const
  name = 'searchbar',
  formProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Searchbar.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...formProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})
