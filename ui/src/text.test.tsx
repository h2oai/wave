import React from 'react'
import { render } from '@testing-library/react'
import { XText, Text } from './text'

const name = 'text'
const textProps: Text = { content: name }

describe('Text.tsx', () => {

  it('Renders data-test attr', () => {
    const { queryByTestId } = render(<XText {...textProps} />)
    expect(queryByTestId(name)).toBeInTheDocument()
  })
})