import React from 'react'
import { render } from '@testing-library/react'
import { View } from './image'
import * as T from './qd'

const
  name = 'image',
  imageProps: T.Card<any> = {
    name,
    state: {},
    changed: T.box(false)
  }

describe('Image.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<View {...imageProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })

})